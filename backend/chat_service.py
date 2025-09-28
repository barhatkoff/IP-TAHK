from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, UploadFile
from typing import List, Optional
from datetime import datetime
import uuid
import aiofiles
import os
from models import Channel, ChannelCreate, Message, MessageType, Reaction

class ChatService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def get_channels(self) -> List[Channel]:
        channels = await self.db.channels.find().to_list(100)
        return [Channel(**channel) for channel in channels]

    async def create_channel(self, channel_data: ChannelCreate, created_by: str) -> Channel:
        channel_dict = {
            "id": str(uuid.uuid4()),
            "name": channel_data.name,
            "type": channel_data.type,
            "description": channel_data.description,
            "is_private": channel_data.is_private,
            "created_by": created_by,
            "created_at": datetime.utcnow()
        }
        
        await self.db.channels.insert_one(channel_dict)
        return Channel(**channel_dict)

    async def get_messages(self, channel_id: str, limit: int = 50) -> List[Message]:
        # Join with users collection to get username and avatar
        pipeline = [
            {"$match": {"channel_id": channel_id}},
            {"$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "id",
                "as": "user"
            }},
            {"$unwind": "$user"},
            {"$project": {
                "id": 1,
                "channel_id": 1,
                "user_id": 1,
                "username": "$user.username",
                "avatar": "$user.avatar",
                "content": 1,
                "type": 1,
                "file_url": 1,
                "reactions": 1,
                "created_at": 1,
                "edited_at": 1
            }},
            {"$sort": {"created_at": -1}},
            {"$limit": limit}
        ]
        
        messages = await self.db.messages.aggregate(pipeline).to_list(limit)
        messages.reverse()  # Return in chronological order
        return [Message(**msg) for msg in messages]

    async def send_message(
        self, 
        channel_id: str, 
        user_id: str, 
        content: str, 
        message_type: str,
        voice_file: Optional[UploadFile] = None
    ) -> Message:
        # Get user info
        user = await self.db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        message_dict = {
            "id": str(uuid.uuid4()),
            "channel_id": channel_id,
            "user_id": user_id,
            "username": user["username"],
            "avatar": user.get("avatar"),
            "content": content,
            "type": message_type,
            "file_url": None,
            "reactions": [],
            "created_at": datetime.utcnow(),
            "edited_at": None
        }

        # Handle voice file upload
        if voice_file and message_type == "voice":
            voice_filename = f"{uuid.uuid4()}_{voice_file.filename}"
            voice_path = f"/app/backend/uploads/voice/{voice_filename}"
            
            os.makedirs(os.path.dirname(voice_path), exist_ok=True)
            
            async with aiofiles.open(voice_path, 'wb') as f:
                content = await voice_file.read()
                await f.write(content)
            
            message_dict["file_url"] = f"/uploads/voice/{voice_filename}"

        await self.db.messages.insert_one(message_dict)
        return Message(**message_dict)

    async def delete_message(self, message_id: str, user_id: str, user_role: str):
        message = await self.db.messages.find_one({"id": message_id})
        if not message:
            raise HTTPException(status_code=404, detail="Message not found")

        # Check permissions
        if message["user_id"] != user_id and user_role not in ["admin", "moderator"]:
            raise HTTPException(status_code=403, detail="Permission denied")

        await self.db.messages.delete_one({"id": message_id})

    async def add_reaction(self, message_id: str, user_id: str, emoji: str):
        message = await self.db.messages.find_one({"id": message_id})
        if not message:
            raise HTTPException(status_code=404, detail="Message not found")

        # Check if user already reacted with this emoji
        reactions = message.get("reactions", [])
        existing_reaction = next(
            (r for r in reactions if r["user_id"] == user_id and r["emoji"] == emoji), 
            None
        )

        if existing_reaction:
            # Remove reaction
            reactions = [r for r in reactions if not (r["user_id"] == user_id and r["emoji"] == emoji)]
        else:
            # Add reaction
            reactions.append({"user_id": user_id, "emoji": emoji})

        await self.db.messages.update_one(
            {"id": message_id},
            {"$set": {"reactions": reactions}}
        )

    async def initialize_default_channels(self):
        """Initialize default channels if they don't exist"""
        existing_channels = await self.db.channels.count_documents({})
        
        if existing_channels == 0:
            default_channels = [
                {
                    "id": str(uuid.uuid4()),
                    "name": "Общий",
                    "type": "text",
                    "description": "Основной чат для всех игроков",
                    "is_private": False,
                    "created_by": "system",
                    "created_at": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "PvP",
                    "type": "text", 
                    "description": "Обсуждение PvP сражений",
                    "is_private": False,
                    "created_by": "system",
                    "created_at": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Помощь новичкам",
                    "type": "text",
                    "description": "Помощь и советы для начинающих игроков",
                    "is_private": False,
                    "created_by": "system",
                    "created_at": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "Голосовая общая",
                    "type": "voice",
                    "description": "Общий голосовой канал",
                    "is_private": False,
                    "created_by": "system", 
                    "created_at": datetime.utcnow()
                },
                {
                    "id": str(uuid.uuid4()),
                    "name": "PvP Команды",
                    "type": "voice",
                    "description": "Голосовой канал для PvP команд",
                    "is_private": False,
                    "created_by": "system",
                    "created_at": datetime.utcnow()
                }
            ]
            
            await self.db.channels.insert_many(default_channels)