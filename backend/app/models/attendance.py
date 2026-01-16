"""
Attendance model and schemas
Defines the structure of attendance records in MongoDB
"""

from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime

AttendanceStatus = Literal["present", "absent", "leave"]

class AttendanceCreate(BaseModel):
    """Schema for marking attendance"""
    subject_id: str
    date: str  # Format: YYYY-MM-DD
    status: AttendanceStatus

class AttendanceResponse(BaseModel):
    """Schema for attendance response"""
    id: str
    subject_id: str
    user_id: str
    date: str
    status: AttendanceStatus
    created_at: datetime

    class Config:
        from_attributes = True

class AttendanceInDB(BaseModel):
    """Schema for attendance stored in MongoDB"""
    subject_id: str
    user_id: str
    date: str
    status: AttendanceStatus
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AttendanceStats(BaseModel):
    """Schema for attendance statistics"""
    total: int
    present: int
    absent: int
    leave: int
    percentage: float
