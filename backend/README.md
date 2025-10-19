# 🚀 Backend - AI Learning Platform

## ⚡ Quick Start (5 Minutes)

### 1. Navigate to Backend
```bash
cd "D:\BPUT Hackathon\By-Me-and-Pratik\backend"
```

### 2. Create Virtual Environment
```bash
python -m venv venv
```

### 3. Activate Virtual Environment
```bash
venv\Scripts\activate
```

### 4. Install All Dependencies
```bash
pip install -r requirements.txt
```

**Note:** Installation takes 2-3 minutes. If you see warnings about Pillow or grpcio, ignore them - they will install correctly.

### 5. Run the Server
```bash
uvicorn app.main:app --reload
```

✅ **Success!** You should see:
```
INFO: Uvicorn running on http://127.0.0.1:8000
INFO: Application startup complete.
```

### 6. Test the API
Open in browser:
- **API Docs:** http://127.0.0.1:8000/docs
- **Health Check:** http://127.0.0.1:8000/health

---

## 🔧 Configuration

The `.env` file is already configured with a working Gemini API key:
```env
GEMINI_API_KEY=AIzaSyBsEZ8i_34J4IAD423pUlWjKP96OM_X0Uc
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=generate-a-secure-random-key-change-in-production
```

**No additional setup needed!** ✨

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── routers/          # 6 API routers (content, ai, auth, etc.)
│   ├── services/         # 5 services (AI, BKT, career, etc.)
│   ├── utils/            # 4 utilities (PDF, DOC, OCR, YouTube)
│   ├── main.py           # FastAPI application
│   ├── models.py         # Database models
│   ├── database.py       # SQLAlchemy setup
│   └── config.py         # Environment config
├── uploads/              # Uploaded files storage
├── venv/                 # Virtual environment
├── requirements.txt      # Python dependencies
└── .env                  # Environment variables
```

---

## 🎯 API Endpoints

### 📤 Content Management
- `POST /api/content/upload` - Upload PDF, DOC, images, YouTube links
- `GET /api/content/list?userId=user_123` - List all content
- `GET /api/content/{content_id}` - Get specific content

### 🤖 AI Features
- `POST /api/ai/enhance` - Simplify content for different levels
- `POST /api/ai/question` - Ask questions with AI answers
- `POST /api/ai/quiz` - Generate adaptive quizzes
- `POST /api/ai/feedback` - Get feedback on answers

### 🔐 Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me?user_id=user_123` - Get user info

### 📊 Progress Tracking
- `POST /api/progress/save` - Save learning progress (BKT)
- `GET /api/progress/{user_id}` - Get mastery levels
- `GET /api/progress/competency/{competency_id}` - Competency stats

### 💼 Career Mapping
- `GET /api/career/recommendations?userId=user_123` - Career matches
- `GET /api/career/skills-gap?userId=user_123&career=Software Developer` - Skills gap
- `GET /api/career/jobs?skills=python,javascript` - Job listings

### 👨🏫 Educator Dashboard
- `GET /api/educator/students?educatorId=edu_123` - List students
- `GET /api/educator/analytics/{student_id}` - Student analytics
- `POST /api/educator/assign-content` - Assign content to students

---

## 🧪 Testing the API

### Method 1: Interactive Docs (Recommended)
1. Go to http://127.0.0.1:8000/docs
2. Click "Try it out" on any endpoint
3. Fill in parameters
4. Click "Execute"

### Method 2: Browser
- Health: http://127.0.0.1:8000/health
- Root: http://127.0.0.1:8000

### Method 3: cURL
```bash
# Health check
curl http://127.0.0.1:8000/health

# Ask AI question
curl -X POST http://127.0.0.1:8000/api/ai/question \
  -H "Content-Type: application/json" \
  -d '{"question":"What is recursion?","userId":"user_123"}'
```

---

## 🐛 Troubleshooting

### ❌ "No module named 'app'"
**Problem:** Running from wrong directory

**Solution:**
```bash
cd "D:\BPUT Hackathon\By-Me-and-Pratik\backend"
uvicorn app.main:app --reload
```

### ❌ "No module named 'youtube_transcript_api'"
**Problem:** Package not installed in venv

**Solution:**
```bash
venv\Scripts\activate
pip install -r requirements.txt
```

### ❌ "Port 8000 already in use"
**Problem:** Another process using port 8000

**Solution:**
```bash
# Find process
netstat -ano | findstr :8000

# Kill process (replace <PID> with actual number)
taskkill /PID <PID> /F
```

### ❌ SQLAlchemy compatibility error (Python 3.13)
**Problem:** Python 3.13 too new

**Solution:**
```bash
pip install --upgrade sqlalchemy
```

### ❌ Virtual environment not activating
**Problem:** Path issues

**Solution:**
```bash
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🔄 Development Workflow

### Daily Startup
```bash
cd "D:\BPUT Hackathon\By-Me-and-Pratik\backend"
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Making Changes
1. Edit files in `app/` directory
2. Server auto-reloads (watch console)
3. Test at http://127.0.0.1:8000/docs

### Adding New Endpoints
1. Edit appropriate router in `app/routers/`
2. Add Pydantic models if needed
3. Test in `/docs`
4. Update API_CONTRACT.md

---

## 📦 Key Dependencies

- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - Database ORM
- **Google Generative AI** - Gemini API
- **PyPDF2** - PDF text extraction
- **python-docx** - Word document processing
- **pytesseract** - OCR for images
- **youtube-transcript-api** - YouTube transcripts
- **passlib** - Password hashing
- **python-jose** - JWT tokens

---

## 🎓 Features Implemented

✅ Multi-format content upload (PDF, DOC, images, YouTube)
✅ AI-powered Q&A with Gemini API
✅ Adaptive quiz generation
✅ Bayesian Knowledge Tracing (BKT)
✅ Progress tracking with mastery levels
✅ Career pathway mapping
✅ Educator analytics dashboard
✅ Authentication with bcrypt
✅ SQLite database with SQLAlchemy
✅ CORS enabled for frontend
✅ File storage system
✅ Caching for AI responses
✅ Error handling and logging

---

## 🚀 Next Steps

1. ✅ Backend is running
2. 🔜 Setup frontend (see `../frontend/README.md`)
3. 🔜 Test full integration
4. 🔜 Deploy to Render.com

---

## 📞 Support

If you encounter issues:
1. Check this README's troubleshooting section
2. Verify you're in the correct directory
3. Ensure venv is activated
4. Check console logs for errors

**Backend is ready! Now setup the frontend.** 🎉
