"""
Subject model and schemas
Defines the structure of subject data in MongoDB
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SubjectCreate(BaseModel):
    """Schema for creating a new subject"""
    name: str = Field(..., min_length=1, max_length=100)
    color: Optional[str] = None

class SubjectResponse(BaseModel):
    """Schema for subject response"""
    id: str
    user_id: str
    name: str
    color: str
    created_at: datetime

    class Config:
        from_attributes = True

class SubjectInDB(BaseModel):
    """Schema for subject stored in MongoDB"""
    user_id: str
    name: str
    color: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
