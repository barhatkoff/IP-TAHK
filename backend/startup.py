<file>
      <absolute_file_name>/app/backend/startup.py</absolute_file_name>
from motor.motor_asyncio import AsyncIOMotorClient
from chat_service import ChatService
import os
import asyncio
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def initialize_database():
    """Initialize database with default channels and demo user"""
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    chat_service = ChatService(db)
    
    # Initialize default channels
    await chat_service.initialize_default_channels()
    print("✅ Default channels initialized")
    
    # Create demo user if not exists
    existing_demo = await db.users.find_one({"username": "demo"})
    if not existing_demo:
        from auth import AuthService
        from passlib.context import CryptContext
        
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        auth_service = AuthService(db)
        
        demo_user = {
            "id": "demo-user-id",
            "username": "demo",
            "email": "demo@example.com",
            "password": pwd_context.hash("demo123"),
            "avatar": None,
            "role": "user",
            "is_online": False,
            "last_seen": None,
            "created_at": None
        }
        
        await db.users.insert_one(demo_user)
        print("✅ Demo user created (demo/demo123)")
    
    client.close()
    print("✅ Database initialization complete")

if __name__ == "__main__":
    asyncio.run(initialize_database())</content>
    </file>