from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

# Channel Models
class ChannelType(str, Enum):
    text = "text"
    voice = "voice"

class ChannelCreate(BaseModel):
    name: str
    type: ChannelType
    description: Optional[str] = None
    is_private: bool = False

class Channel(BaseModel):
    id: str
    name: str
    type: ChannelType
    description: Optional[str]
    is_private: bool
    created_by: str
    created_at: datetime

# Message Models
class MessageType(str, Enum):
    text = "text"
    voice = "voice"
    image = "image"

class Reaction(BaseModel):
    user_id: str
    emoji: str

class MessageCreate(BaseModel):
    content: str
    type: MessageType = MessageType.text

class Message(BaseModel):
    id: str
    channel_id: str
    user_id: str
    username: str
    avatar: Optional[str]
    content: str
    type: MessageType
    file_url: Optional[str]
    reactions: List[Reaction] = []
    created_at: datetime
    edited_at: Optional[datetime]

# Voice Models
class VoiceParticipant(BaseModel):
    user_id: str
    username: str
    avatar: Optional[str]
    is_muted: bool = False
    joined_at: datetime

class VoiceChannel(BaseModel):
    channel_id: str
    participants: List[VoiceParticipant] = []

# Event Models
class EventType(str, Enum):
    tournament = "tournament"
    bonus = "bonus"
    update = "update"
    event = "event"

class EventCreate(BaseModel):
    title: str
    description: str
    date: str
    type: EventType
    image: Optional[str] = None

class Event(BaseModel):
    id: str
    title: str
    description: str
    date: str
    type: EventType
    image: Optional[str]
    created_by: str
    created_at: datetime

# Server Models
class ServerStatus(BaseModel):
    online: bool
    players: int
    max_players: int
    uptime: str
    ping: int
    version: str

class OnlinePlayer(BaseModel):
    nickname: str
    playtime: str
    level: Optional[int] = None