"""
User model and schemas
Defines the structure of user data in MongoDB
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId

# Custom ObjectId type for Pydantic
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

# Request schemas
class UserRegister(BaseModel):
    """Schema for user registration request"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    """Schema for user login request"""
    email: EmailStr
    password: str

# Response schemas
class UserResponse(BaseModel):
    """Schema for user response (excludes password)"""
    id: str
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Database model
class UserInDB(BaseModel):
    """Schema for user stored in MongoDB"""
    name: str
    email: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
