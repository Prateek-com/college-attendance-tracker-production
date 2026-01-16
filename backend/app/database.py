"""
Database connection module
Handles MongoDB connection using Motor (async driver)
Works for:
- Local MongoDB
- MongoDB Atlas
- Render free server
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables (.env for local, Render ENV for server)
load_dotenv()

# MongoDB connection string
MONGO_URL = os.getenv("MONGODB_URI")

if not MONGO_URL:
    raise RuntimeError("❌ MONGO_URL environment variable not set")

# Global MongoDB client & database
client: AsyncIOMotorClient | None = None
database = None


async def connect_to_mongo():
    """
    Connect to MongoDB when FastAPI starts.
    Connection remains open during app lifecycle.
    """
    global client, database

    print("🔌 Connecting to MongoDB...")

    client = AsyncIOMotorClient(MONGO_URL)
    database = client.get_default_database()

    # Verify connection
    await client.admin.command("ping")
    print("✅ MongoDB connected successfully")


async def close_mongo_connection():
    """
    Close MongoDB connection on app shutdown.
    """
    global client

    if client:
        client.close()
        print("🔒 MongoDB connection closed")


def get_database():
    """
    Returns database instance (used in routes).
    """
    return database


# ---------- Collection helpers (SAFE & CLEAN) ----------

def get_users_collection():
    return database["users"]


def get_subjects_collection():
    return database["subjects"]


def get_attendance_collection():
    return database["attendance"]
