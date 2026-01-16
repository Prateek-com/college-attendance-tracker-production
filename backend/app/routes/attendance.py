"""
Attendance routes
Handles attendance marking and retrieval
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.database import get_attendance_collection, get_subjects_collection
from app.models.attendance import AttendanceCreate, AttendanceResponse, AttendanceStats
from app.routes.auth import get_current_user

router = APIRouter()

@router.get("/{subject_id}", response_model=List[AttendanceResponse])
async def get_attendance(
    subject_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all attendance records for a subject.
    
    Example MongoDB find:
    attendance.find({"subject_id": "...", "user_id": "user123"})
    """
    attendance = get_attendance_collection()
    subjects = get_subjects_collection()
    
    # Verify subject belongs to user
    subject = await subjects.find_one({
        "_id": ObjectId(subject_id),
        "user_id": current_user["id"]
    })
    
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    
    cursor = attendance.find({
        "subject_id": subject_id,
        "user_id": current_user["id"]
    })
    
    records = []
    async for record in cursor:
        records.append(AttendanceResponse(
            id=str(record["_id"]),
            subject_id=record["subject_id"],
            user_id=record["user_id"],
            date=record["date"],
            status=record["status"],
            created_at=record["created_at"]
        ))
    
    return records

@router.post("/", response_model=AttendanceResponse)
async def mark_attendance(
    attendance_data: AttendanceCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Mark or update attendance for a subject on a specific date.
    
    Example MongoDB upsert:
    attendance.update_one(
        {"subject_id": "...", "user_id": "...", "date": "2024-01-15"},
        {"$set": {"status": "present", ...}},
        upsert=True
    )
    """
    attendance = get_attendance_collection()
    subjects = get_subjects_collection()
    
    # Verify subject belongs to user
    subject = await subjects.find_one({
        "_id": ObjectId(attendance_data.subject_id),
        "user_id": current_user["id"]
    })
    
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    
    # Check if attendance record exists for this date
    existing = await attendance.find_one({
        "subject_id": attendance_data.subject_id,
        "user_id": current_user["id"],
        "date": attendance_data.date
    })
    
    if existing:
        # Update existing record
        await attendance.update_one(
            {"_id": existing["_id"]},
            {"$set": {"status": attendance_data.status}}
        )
        
        print(f"✅ Attendance updated in MongoDB: {attendance_data.date} -> {attendance_data.status}")
        
        return AttendanceResponse(
            id=str(existing["_id"]),
            subject_id=attendance_data.subject_id,
            user_id=current_user["id"],
            date=attendance_data.date,
            status=attendance_data.status,
            created_at=existing["created_at"]
        )
    else:
        # Create new record
        new_record = {
            "subject_id": attendance_data.subject_id,
            "user_id": current_user["id"],
            "date": attendance_data.date,
            "status": attendance_data.status,
            "created_at": datetime.utcnow()
        }
        
        result = await attendance.insert_one(new_record)
        
        print(f"✅ Attendance marked in MongoDB: {attendance_data.date} -> {attendance_data.status}")
        
        return AttendanceResponse(
            id=str(result.inserted_id),
            subject_id=attendance_data.subject_id,
            user_id=current_user["id"],
            date=attendance_data.date,
            status=attendance_data.status,
            created_at=new_record["created_at"]
        )

@router.get("/{subject_id}/stats", response_model=AttendanceStats)
async def get_attendance_stats(
    subject_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get attendance statistics for a subject.
    
    Example MongoDB aggregation:
    attendance.aggregate([
        {"$match": {"subject_id": "...", "user_id": "..."}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ])
    """
    attendance = get_attendance_collection()
    subjects = get_subjects_collection()
    
    # Verify subject belongs to user
    subject = await subjects.find_one({
        "_id": ObjectId(subject_id),
        "user_id": current_user["id"]
    })
    
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    
    # Aggregate attendance counts
    pipeline = [
        {"$match": {"subject_id": subject_id, "user_id": current_user["id"]}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    
    cursor = attendance.aggregate(pipeline)
    
    stats = {"present": 0, "absent": 0, "leave": 0}
    async for doc in cursor:
        stats[doc["_id"]] = doc["count"]
    
    total = stats["present"] + stats["absent"] + stats["leave"]
    percentage = (stats["present"] / total * 100) if total > 0 else 0
    
    return AttendanceStats(
        total=total,
        present=stats["present"],
        absent=stats["absent"],
        leave=stats["leave"],
        percentage=round(percentage, 1)
    )
