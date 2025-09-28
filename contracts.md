# API Contracts & Integration Guide

## Backend Development Plan

### 1. Authentication System
**Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

**Models:**
```javascript
User {
  id: string,
  username: string,
  email: string,
  password: string (hashed),
  avatar: string,
  role: enum('user', 'moderator', 'admin'),
  isOnline: boolean,
  lastSeen: Date,
  createdAt: Date
}
```

### 2. Chat System (Discord-like)
**Real-time Features (Socket.IO):**
- Text messaging
- Voice message recording/playback
- User presence (online/offline)
- Typing indicators
- Message reactions

**Endpoints:**
- `GET /api/channels` - Get all channels
- `POST /api/channels` - Create new channel (admin/moderator)
- `GET /api/channels/:id/messages` - Get channel messages
- `POST /api/channels/:id/messages` - Send message
- `DELETE /api/messages/:id` - Delete message (owner/moderator)
- `POST /api/messages/:id/reactions` - Add reaction

**Models:**
```javascript
Channel {
  id: string,
  name: string,
  type: enum('text', 'voice'),
  description: string,
  isPrivate: boolean,
  createdBy: string,
  createdAt: Date
}

Message {
  id: string,
  channelId: string,
  userId: string,
  content: string,
  type: enum('text', 'voice', 'image'),
  fileUrl: string, // for voice messages/images
  reactions: [{userId: string, emoji: string}],
  createdAt: Date,
  editedAt: Date
}
```

### 3. Voice Chat System (WebRTC)
**Features:**
- Peer-to-peer voice communication
- Voice channel rooms
- Mute/unmute functionality
- Push-to-talk option

**Endpoints:**
- `POST /api/voice/join/:channelId` - Join voice channel
- `POST /api/voice/leave/:channelId` - Leave voice channel
- `GET /api/voice/channels/:id/participants` - Get voice participants

### 4. Content Management System
**Current Mocked Data to Backend:**
- Events (`recentEvents` from mockData.js)
- Server Rules (`serverRules` from mockData.js)
- Player Guides (`playerGuides` from mockData.js)
- Community News (`communityNews` from mockData.js)
- Online Players (real-time from game server)

**Endpoints:**
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)
- `PUT /api/events/:id` - Update event (admin)
- `DELETE /api/events/:id` - Delete event (admin)
- Similar CRUD for rules, guides, news

### 5. Game Server Integration
**Features:**
- Real-time player count
- Server status monitoring
- Player statistics sync
- Leaderboard updates

**Endpoints:**
- `GET /api/server/status` - Get server status
- `GET /api/server/players` - Get online players
- `GET /api/leaderboards` - Get leaderboards

## Frontend Integration Changes

### Remove Mock Data
Files to update:
- Remove `mockData.js` usage from all components
- Replace with API calls using axios
- Add loading states and error handling

### Add New Features
1. **Authentication Context**
   - User login/registration
   - Profile management
   - Role-based access control

2. **Chat Component**
   - Real-time messaging interface
   - Voice message recording
   - Channel sidebar
   - User list with online status

3. **Voice Chat Component**
   - Join/leave voice channels
   - Mute/unmute controls
   - Participant list

## Technology Stack

### Backend:
- **Framework:** FastAPI (Python)
- **Database:** MongoDB
- **Real-time:** Socket.IO (python-socketio)
- **Authentication:** JWT tokens
- **File Storage:** Local storage + CloudFlare/AWS S3 for voice messages
- **Voice Processing:** WebRTC signaling server

### Frontend:
- **Real-time:** Socket.IO client
- **Voice:** WebRTC API
- **Audio Recording:** MediaRecorder API
- **State Management:** React Context
- **UI Components:** Existing shadcn/ui components

## Implementation Priority
1. ✅ **Phase 1: Basic Backend Setup** (Current)
2. **Phase 2: Authentication System**
3. **Phase 3: Text Chat System**
4. **Phase 4: Voice Messaging**
5. **Phase 5: Voice Channels (WebRTC)**
6. **Phase 6: Content Management Integration**

## Security Considerations
- JWT token validation
- Rate limiting for messages
- File upload restrictions
- WebRTC security (TURN servers)
- Message content filtering
- User role permissions

## Real-time Architecture
```
Client ↔ Socket.IO ↔ FastAPI Server ↔ MongoDB
                ↓
         WebRTC Signaling
                ↓
    Voice Channel Management
```

This architecture will provide a complete Discord-like experience integrated into the game community website.