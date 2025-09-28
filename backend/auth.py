from fastapi import Depends, HTTPException, status, UploadFile
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel, EmailStr
from motor.motor_asyncio import AsyncIOMotorDatabase
import uuid
import aiofiles
import os

# JWT Configuration
SECRET_KEY = "deadside_secret_key_2024_very_secure"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# Pydantic models
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: str
    avatar: Optional[str] = None
    role: str = "user"
    is_online: bool = False
    last_seen: datetime
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db

    def verify_password(self, plain_password, hashed_password):
        return pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return pwd_context.hash(password)

    def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    async def get_user_by_username(self, username: str):
        user = await self.db.users.find_one({"username": username})
        if user:
            return User(**user)
        return None

    async def get_user_by_email(self, email: str):
        user = await self.db.users.find_one({"email": email})
        if user:
            return User(**user)
        return None

    async def get_user_by_id(self, user_id: str):
        user = await self.db.users.find_one({"id": user_id})
        if user:
            return User(**user)
        return None

    async def create_user(self, user: UserCreate):
        # Check if user already exists
        existing_user = await self.get_user_by_username(user.username)
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username already registered"
            )
        
        existing_email = await self.get_user_by_email(user.email)
        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # Create new user
        user_dict = {
            "id": str(uuid.uuid4()),
            "username": user.username,
            "email": user.email,
            "password": self.get_password_hash(user.password),
            "avatar": None,
            "role": "user",
            "is_online": True,
            "last_seen": datetime.utcnow(),
            "created_at": datetime.utcnow()
        }

        await self.db.users.insert_one(user_dict)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        # Remove password from response
        del user_dict["password"]
        user_obj = User(**user_dict)

        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user_obj
        )

    async def authenticate_user(self, user_login: UserLogin):
        user = await self.get_user_by_username(user_login.username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_dict = await self.db.users.find_one({"username": user_login.username})
        if not self.verify_password(user_login.password, user_dict["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Update online status
        await self.db.users.update_one(
            {"id": user.id},
            {"$set": {"is_online": True, "last_seen": datetime.utcnow()}}
        )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self.create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        user.is_online = True
        user.last_seen = datetime.utcnow()

        return Token(
            access_token=access_token,
            token_type="bearer",
            user=user
        )

    async def update_user_profile(self, user_id: str, username: str, email: str, avatar: UploadFile = None):
        update_data = {
            "username": username,
            "email": email
        }

        if avatar:
            # Save avatar file
            avatar_filename = f"{user_id}_{avatar.filename}"
            avatar_path = f"/app/backend/uploads/avatars/{avatar_filename}"
            
            os.makedirs(os.path.dirname(avatar_path), exist_ok=True)
            
            async with aiofiles.open(avatar_path, 'wb') as f:
                content = await avatar.read()
                await f.write(content)
            
            update_data["avatar"] = f"/uploads/avatars/{avatar_filename}"

        await self.db.users.update_one(
            {"id": user_id},
            {"$set": update_data}
        )

        return await self.get_user_by_id(user_id)

    async def set_user_offline(self, user_id: str):
        await self.db.users.update_one(
            {"id": user_id},
            {"$set": {"is_online": False, "last_seen": datetime.utcnow()}}
        )

# Dependency to get current user
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Get database connection
    from server import db
    auth_service = AuthService(db)
    user = await auth_service.get_user_by_username(username)
    if user is None:
        raise credentials_exception
    return user