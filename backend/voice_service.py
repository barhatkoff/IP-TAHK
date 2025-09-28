from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from typing import List
from datetime import datetime
import uuid
from models import VoiceParticipant, VoiceChannel

class VoiceService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    async def join_voice_channel(self, channel_id: str, user_id: str) -> VoiceParticipant:
        # Check if channel exists and is voice type
        channel = await self.db.channels.find_one({
            "id": channel_id, 
            "type": "voice"
        })
        if not channel:
            raise HTTPException(status_code=404, detail="Voice channel not found")

        # Get user info
        user = await self.db.users.find_one({"id": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if user is already in the voice channel
        existing_participant = await self.db.voice_participants.find_one({
            "channel_id": channel_id,
            "user_id": user_id
        })

        if existing_participant:
            return VoiceParticipant(**existing_participant)

        # Add user to voice channel
        participant_dict = {
            "id": str(uuid.uuid4()),
            "channel_id": channel_id,
            "user_id": user_id,
            "username": user["username"],
            "avatar": user.get("avatar"),
            "is_muted": False,
            "joined_at": datetime.utcnow()
        }

        await self.db.voice_participants.insert_one(participant_dict)
        return VoiceParticipant(**participant_dict)

    async def leave_voice_channel(self, channel_id: str, user_id: str):
        result = await self.db.voice_participants.delete_one({
            "channel_id": channel_id,
            "user_id": user_id
        })
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not in voice channel")

    async def get_voice_participants(self, channel_id: str) -> List[VoiceParticipant]:
        participants = await self.db.voice_participants.find({
            "channel_id": channel_id
        }).to_list(100)
        
        return [VoiceParticipant(**p) for p in participants]

    async def toggle_mute(self, channel_id: str, user_id: str, is_muted: bool):
        result = await self.db.voice_participants.update_one(
            {"channel_id": channel_id, "user_id": user_id},
            {"$set": {"is_muted": is_muted}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not in voice channel")

    async def kick_from_voice(self, channel_id: str, target_user_id: str, moderator_user_id: str):
        # Check if moderator has permissions
        moderator = await self.db.users.find_one({"id": moderator_user_id})
        if not moderator or moderator.get("role") not in ["admin", "moderator"]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")

        await self.leave_voice_channel(channel_id, target_user_id)