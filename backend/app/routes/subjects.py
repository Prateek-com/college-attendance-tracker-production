"""
Subject routes
Handles CRUD operations for subjects
"""

from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from datetime import datetime
from bson import ObjectId

from app.database import get_subjects_collection, get_attendance_collection
from app.models.subject import SubjectCreate, SubjectResponse
from app.routes.auth import get_current_user

router = APIRouter()

# Color palette for subjects
SUBJECT_COLORS = [
    "#8B5CF6", "#EC4899", "#F59E0B", "#10B981",
    "#3B82F6", "#EF4444", "#6366F1", "#14B8A6"
]

@router.get("/", response_model=List[SubjectResponse])
async def get_subjects(current_user: dict = Depends(get_current_user)):
    """
    Get all subjects for the current user.
    
    Example MongoDB find:
    subjects.find({"user_id": "user123"})
    """
    subjects = get_subjects_collection()
    
    cursor = subjects.find({"user_id": current_user["id"]})
    subject_list = []
    
    async for subject in cursor:
        subject_list.append(SubjectResponse(
            id=str(subject["_id"]),
            user_id=subject["user_id"],
            name=subject["name"],
            color=subject["color"],
            created_at=subject["created_at"]
        ))
    
    return subject_list

@router.post("/", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(
    subject_data: SubjectCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new subject for the current user.
    
    Example MongoDB insert:
    subjects.insert_one({
        "user_id": "user123",
        "name": "Mathematics",
        "color": "#8B5CF6",
        "created_at": datetime.utcnow()
    })
    """
    subjects = get_subjects_collection()
    
    # Check if subject with same name exists for this user
    existing = await subjects.find_one({
        "user_id": current_user["id"],
        "name": subject_data.name
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subject with this name already exists"
        )
    
    # Count existing subjects to assign color
    count = await subjects.count_documents({"user_id": current_user["id"]})
    color = subject_data.color or SUBJECT_COLORS[count % len(SUBJECT_COLORS)]
    
    # Create new subject document
    new_subject = {
        "user_id": current_user["id"],
        "name": subject_data.name,
        "color": color,
        "created_at": datetime.utcnow()
    }
    
    # Insert into MongoDB
    result = await subjects.insert_one(new_subject)
    
    print(f"✅ Subject created in MongoDB: {subject_data.name}")
    
    return SubjectResponse(
        id=str(result.inserted_id),
        user_id=current_user["id"],
        name=subject_data.name,
        color=color,
        created_at=new_subject["created_at"]
    )

@router.delete("/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_subject(
    subject_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a subject and all its attendance records.
    
    Example MongoDB delete:
    subjects.delete_one({"_id": ObjectId("..."), "user_id": "user123"})
    attendance.delete_many({"subject_id": "..."})
    """
    subjects = get_subjects_collection()
    attendance = get_attendance_collection()
    
    # Check if subject exists and belongs to user
    subject = await subjects.find_one({
        "_id": ObjectId(subject_id),
        "user_id": current_user["id"]
    })
    
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subject not found"
        )
    
    # Delete all attendance records for this subject
    await attendance.delete_many({"subject_id": subject_id})
    
    # Delete the subject
    await subjects.delete_one({"_id": ObjectId(subject_id)})
    
    print(f"✅ Subject deleted from MongoDB: {subject['name']}")
    
    return None
