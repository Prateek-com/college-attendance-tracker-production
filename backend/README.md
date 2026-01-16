# College Attendance Tracker - Backend

FastAPI + MongoDB backend for the College Attendance Tracker.

## 🚀 Quick Setup

### Prerequisites
- Python 3.9+ installed
- MongoDB installed locally OR MongoDB Atlas account

### Step 1: Install MongoDB (Local)

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB runs automatically as a service

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
```

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI if using Atlas
```

### Step 3: Run the Server

```bash
# Start the FastAPI server
uvicorn main:app --reload --port 8000
```

Server runs at: http://localhost:8000

## 📚 API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user profile |
| GET | /api/auth/users | List all users (testing) |

### Subjects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/subjects | Get user's subjects |
| POST | /api/subjects | Create new subject |
| DELETE | /api/subjects/{id} | Delete a subject |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/attendance/{subject_id} | Get attendance records |
| POST | /api/attendance | Mark attendance |
| GET | /api/attendance/{subject_id}/stats | Get attendance stats |

## 🧪 Testing API

### Register a User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Check MongoDB Data
```bash
# Open MongoDB shell
mongosh

# Use the database
use attendance_tracker

# View users (data persists after server restart!)
db.users.find().pretty()

# View subjects
db.subjects.find().pretty()

# View attendance
db.attendance.find().pretty()
```

## 📁 Project Structure

```
backend/
├── main.py              # FastAPI app entry point
├── database.py          # MongoDB connection
├── models/
│   ├── __init__.py
│   ├── user.py          # User schemas
│   ├── subject.py       # Subject schemas
│   └── attendance.py    # Attendance schemas
├── routes/
│   ├── __init__.py
│   ├── auth.py          # Auth endpoints
│   ├── subjects.py      # Subject endpoints
│   └── attendance.py    # Attendance endpoints
├── requirements.txt     # Python dependencies
├── .env.example         # Environment template
└── README.md            # This file
```

## ✅ Data Persistence

- All data is stored in MongoDB
- Data survives server restarts
- Each user's data is isolated by user_id
- Passwords are hashed with bcrypt

## 🔐 Security

- JWT token authentication
- Password hashing with bcrypt
- CORS configured for React frontend
- Protected routes require valid token
