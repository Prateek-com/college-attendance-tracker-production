"""
College Attendance Tracker - FastAPI Backend
Main entry point for the application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import connect_to_mongo, close_mongo_connection
from app.routes.auth import router as auth_router
from app.routes.subjects import router as subjects_router
from app.routes.attendance import router as attendance_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await connect_to_mongo()
    yield
    # Shutdown: Close MongoDB connection
    await close_mongo_connection()

app = FastAPI(
    title="College Attendance Tracker API",
    description="Backend API for tracking college attendance",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - allows React frontend to connect from any origin (for local dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(subjects_router, prefix="/api/subjects", tags=["Subjects"])
app.include_router(attendance_router, prefix="/api/attendance", tags=["Attendance"])

@app.get("/")
async def root():
    return {"message": "College Attendance Tracker API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
