# College Attendance Tracker - Complete Local Setup

## 🎯 What This Fixes
- ✅ Data persists after server restart
- ✅ Login works with same credentials after restart
- ✅ Subjects remain saved in MongoDB
- ✅ No more localStorage - everything in database

---

## 🖥️ VS Code Extensions

### Required
- **Python** (Microsoft) - Python language support
- **Pylance** - Python IntelliSense

### Recommended
- **MongoDB for VS Code** - Browse MongoDB data
- **Thunder Client** - API testing (like Postman)
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete

---

## 🔧 Backend Setup (FastAPI + MongoDB)

### Step 1: Install MongoDB

#### Option A: Local MongoDB (Recommended)

**Windows:**
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run installer with default settings
3. MongoDB starts automatically as Windows service

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update MONGODB_URI in .env

### Step 2: Setup Python Environment

```bash
# Open terminal in VS Code (Ctrl + `)

# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# Windows CMD:
venv\Scripts\activate.bat
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment

```bash
# Create .env from template
cp .env.example .env
```

Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=attendance_tracker
JWT_SECRET=your-super-secret-key-change-this
```

### Step 4: Run Backend Server

```bash
# Make sure virtual environment is activated
uvicorn main:app --reload --port 8000
```

✅ Backend running at: http://localhost:8000
📚 API Docs at: http://localhost:8000/docs

---

## 🎨 Frontend Setup (React + Vite)

### Step 1: Install Dependencies

```bash
# In project root folder
npm install
```

### Step 2: Run Frontend

```bash
npm run dev
```

✅ Frontend running at: http://localhost:5173

---

## 🧪 Test the Full Flow

### 1. Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
uvicorn main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### 2. Test Registration & Login

1. Open http://localhost:5173
2. Click "Get Started" 
3. Register with email/password
4. Add some subjects
5. **STOP the backend server** (Ctrl+C)
6. **START the backend server** again
7. Login with the SAME credentials
8. ✅ Your subjects should still be there!

### 3. Verify Data in MongoDB

```bash
mongosh
use attendance_tracker
db.users.find().pretty()
db.subjects.find().pretty()
```

---

## 📁 Project Structure

```
college-attendance-tracker/
├── backend/                    # FastAPI Backend
│   ├── main.py                 # Entry point
│   ├── database.py             # MongoDB connection
│   ├── models/
│   │   ├── user.py
│   │   ├── subject.py
│   │   └── attendance.py
│   ├── routes/
│   │   ├── auth.py             # /api/auth/*
│   │   ├── subjects.py         # /api/subjects/*
│   │   └── attendance.py       # /api/attendance/*
│   ├── requirements.txt
│   └── .env.example
│
├── src/                        # React Frontend
│   ├── lib/api.ts              # API connection layer
│   ├── contexts/AuthContext.tsx
│   ├── hooks/useSubjects.ts
│   ├── hooks/useAttendance.ts
│   └── ...
│
└── SETUP_INSTRUCTIONS.md
```

---

## ⚠️ Troubleshooting

### "Failed to connect to server"
Backend is not running. Start it with:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### MongoDB Connection Error
Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### CORS Error
The backend already allows http://localhost:5173. If using different port, update `main.py`.

---

## ✅ Success Checklist

- [ ] MongoDB installed and running
- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] Registered a test user
- [ ] Added subjects
- [ ] **Stopped and restarted backend**
- [ ] **Logged in with same credentials - SUCCESS!**
- [ ] **Subjects still visible - SUCCESS!**

---

## 🎯 Quick Start (After Initial Setup)

```bash
# Terminal 1: Backend
cd backend && .\venv\Scripts\activate && uvicorn main:app --reload --port 8000

# Terminal 2: Frontend  
npm run dev
```

Your data is now permanent! 🎉
