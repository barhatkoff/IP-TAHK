from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import socketio
import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import List, Optional
import uuid
import json

# Import our modules
from auth import AuthService, get_current_user, User, UserCreate, UserLogin, Token
from models import *
from chat_service import ChatService
from voice_service import VoiceService

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize services
auth_service = AuthService(db)
chat_service = ChatService(db)
voice_service = VoiceService(db)

# Socket.IO server for real-time chat
sio = socketio.AsyncServer(
    cors_allowed_origins="*",
    async_mode='asgi'
)

# Create the main FastAPI app
app = FastAPI()

# Create Socket.IO ASGI app
socket_app = socketio.ASGIApp(sio, app)

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# ================== AUTH ENDPOINTS ==================

@api_router.post("/auth/register", response_model=Token)
async def register(user: UserCreate):
    return await auth_service.create_user(user)

@api_router.post("/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_login = UserLogin(username=form_data.username, password=form_data.password)
    return await auth_service.authenticate_user(user_login)

@api_router.get("/auth/profile", response_model=User)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.put("/auth/profile", response_model=User)
async def update_profile(
    username: str = Form(...),
    email: str = Form(...),
    avatar: UploadFile = File(None),
    current_user: User = Depends(get_current_user)
):
    return await auth_service.update_user_profile(current_user.id, username, email, avatar)

# ================== CHAT ENDPOINTS ==================

@api_router.get("/channels", response_model=List[Channel])
async def get_channels(current_user: User = Depends(get_current_user)):
    return await chat_service.get_channels()

@api_router.post("/channels", response_model=Channel)
async def create_channel(channel: ChannelCreate, current_user: User = Depends(get_current_user)):
    if current_user.role not in ['admin', 'moderator']:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return await chat_service.create_channel(channel, current_user.id)

@api_router.get("/channels/{channel_id}/messages", response_model=List[Message])
async def get_messages(
    channel_id: str, 
    limit: int = 50,
    current_user: User = Depends(get_current_user)
):
    return await chat_service.get_messages(channel_id, limit)

@api_router.post("/channels/{channel_id}/messages", response_model=Message)
async def send_message(
    channel_id: str,
    content: str = Form(...),
    message_type: str = Form("text"),
    voice_file: UploadFile = File(None),
    current_user: User = Depends(get_current_user)
):
    message = await chat_service.send_message(
        channel_id, current_user.id, content, message_type, voice_file
    )
    # Emit to all connected clients in the channel
    await sio.emit('new_message', message.dict(), room=f'channel_{channel_id}')
    return message

@api_router.delete("/messages/{message_id}")
async def delete_message(message_id: str, current_user: User = Depends(get_current_user)):
    await chat_service.delete_message(message_id, current_user.id, current_user.role)
    await sio.emit('message_deleted', {'message_id': message_id})
    return {"message": "Message deleted"}

@api_router.post("/messages/{message_id}/reactions")
async def add_reaction(
    message_id: str, 
    emoji: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    await chat_service.add_reaction(message_id, current_user.id, emoji)
    await sio.emit('reaction_added', {
        'message_id': message_id, 
        'user_id': current_user.id, 
        'emoji': emoji
    })
    return {"message": "Reaction added"}

# ================== VOICE ENDPOINTS ==================

@api_router.post("/voice/join/{channel_id}")
async def join_voice_channel(channel_id: str, current_user: User = Depends(get_current_user)):
    participant = await voice_service.join_voice_channel(channel_id, current_user.id)
    await sio.emit('user_joined_voice', {
        'channel_id': channel_id,
        'user': current_user.dict()
    }, room=f'voice_{channel_id}')
    return participant

@api_router.post("/voice/leave/{channel_id}")
async def leave_voice_channel(channel_id: str, current_user: User = Depends(get_current_user)):
    await voice_service.leave_voice_channel(channel_id, current_user.id)
    await sio.emit('user_left_voice', {
        'channel_id': channel_id,
        'user_id': current_user.id
    }, room=f'voice_{channel_id}')
    return {"message": "Left voice channel"}

@api_router.get("/voice/channels/{channel_id}/participants")
async def get_voice_participants(channel_id: str, current_user: User = Depends(get_current_user)):
    return await voice_service.get_voice_participants(channel_id)

# ================== CONTENT MANAGEMENT ==================

@api_router.get("/events", response_model=List[Event])
async def get_events():
    events = await db.events.find().sort("date", -1).to_list(100)
    return [Event(**event) for event in events]

@api_router.post("/events", response_model=Event)
async def create_event(event: EventCreate, current_user: User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    event_dict = event.dict()
    event_dict['id'] = str(uuid.uuid4())
    event_dict['created_by'] = current_user.id
    event_dict['created_at'] = datetime.utcnow()
    await db.events.insert_one(event_dict)
    return Event(**event_dict)

@api_router.get("/server/status")
async def get_server_status():
    # Mock server status - in real implementation, this would connect to game server
    return {
        "online": True,
        "players": 247,
        "max_players": 300,
        "uptime": "99.8%",
        "ping": 15,
        "version": "0.7.1.2"
    }

@api_router.get("/server/players")
async def get_online_players():
    # Mock online players - in real implementation, this would fetch from game server
    players = await db.online_players.find().to_list(100)
    return players if players else [
        {"nickname": "SniperWolf_RU", "playtime": "12h 34m"},
        {"nickname": "DeadEye2024", "playtime": "8h 15m"},
        {"nickname": "RussianBear", "playtime": "6h 42m"}
    ]

# ================== SOCKET.IO EVENTS ==================

@sio.event
async def connect(sid, environ):
    print(f"Client {sid} connected")

@sio.event
async def disconnect(sid):
    print(f"Client {sid} disconnected")
    # Update user offline status
    await auth_service.set_user_offline(sid)

@sio.event
async def join_channel(sid, data):
    channel_id = data['channel_id']
    await sio.enter_room(sid, f'channel_{channel_id}')
    print(f"Client {sid} joined channel {channel_id}")

@sio.event
async def leave_channel(sid, data):
    channel_id = data['channel_id']
    await sio.leave_room(sid, f'channel_{channel_id}')
    print(f"Client {sid} left channel {channel_id}")

@sio.event
async def join_voice_room(sid, data):
    channel_id = data['channel_id']
    await sio.enter_room(sid, f'voice_{channel_id}')
    print(f"Client {sid} joined voice room {channel_id}")

@sio.event
async def typing_start(sid, data):
    channel_id = data['channel_id']
    user_id = data['user_id']
    await sio.emit('user_typing', {'user_id': user_id}, room=f'channel_{channel_id}', skip_sid=sid)

@sio.event
async def typing_stop(sid, data):
    channel_id = data['channel_id']
    user_id = data['user_id']
    await sio.emit('user_stopped_typing', {'user_id': user_id}, room=f'channel_{channel_id}', skip_sid=sid)

# WebRTC Signaling for voice chat
@sio.event
async def webrtc_offer(sid, data):
    target_sid = data['target']
    await sio.emit('webrtc_offer', {
        'offer': data['offer'],
        'from': sid
    }, room=target_sid)

@sio.event
async def webrtc_answer(sid, data):
    target_sid = data['target']
    await sio.emit('webrtc_answer', {
        'answer': data['answer'],
        'from': sid
    }, room=target_sid)

@sio.event
async def webrtc_ice_candidate(sid, data):
    target_sid = data['target']
    await sio.emit('webrtc_ice_candidate', {
        'candidate': data['candidate'],
        'from': sid
    }, room=target_sid)

# Include API router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()