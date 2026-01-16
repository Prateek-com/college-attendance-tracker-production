"""
Authentication routes
Handles user registration, login, and profile
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
import os

from dotenv import load_dotenv
from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field

from app.database import get_users_collection

load_dotenv()

router = APIRouter()
security = HTTPBearer()

# ================= JWT CONFIG =================
SECRET_KEY = os.getenv("JWT_SECRET", "change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# ================= PASSWORD HASHING =================
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ================= TOKEN =================
def create_access_token(user_id: str, email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {
        "sub": user_id,
        "email": email,
        "exp": expire
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# ================= SCHEMAS =================
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ================= AUTH DEP =================
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        users = get_users_collection()
        user = await users.find_one({"_id": ObjectId(user_id)})

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "created_at": user["created_at"],
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ================= ROUTES =================
@router.post("/register", response_model=TokenResponse)
async def register(user: UserRegister):
    users = get_users_collection()

    if await users.find_one({"email": user.email.lower()}):
        raise HTTPException(status_code=409, detail="Email already exists")

    new_user = {
        "name": user.name.strip(),
        "email": user.email.lower(),
        "hashed_password": hash_password(user.password),
        "created_at": datetime.utcnow(),
    }

    result = await users.insert_one(new_user)
    user_id = str(result.inserted_id)

    token = create_access_token(user_id, user.email.lower())

    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            name=new_user["name"],
            email=new_user["email"],
            created_at=new_user["created_at"],
        ),
    )

@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    users = get_users_collection()
    db_user = await users.find_one({"email": user.email.lower()})

    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(str(db_user["_id"]), db_user["email"])

    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=str(db_user["_id"]),
            name=db_user["name"],
            email=db_user["email"],
            created_at=db_user["created_at"],
        ),
    )

@router.get("/me", response_model=UserResponse)
async def me(current_user=Depends(get_current_user)):
    return UserResponse(**current_user)
