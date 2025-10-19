# 👨💻 Dev 2 - Backend Development Tasks

## 🎯 Your Responsibility
All files in `backend/` directory

## ⚡ Quick Setup

```bash
# Create backend directory
mkdir backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install dependencies
pip install fastapi uvicorn sqlalchemy
pip install google-generativeai
pip install PyPDF2 python-docx pytesseract pillow
pip install youtube-transcript-api
pip install python-multipart
pip install pydantic-settings
pip install python-jose passlib bcrypt

# Save dependencies
pip freeze > requirements.txt

# Run server
uvicorn app.main:app --reload
```

## 📁 File Structure You'll Create

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── config.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── content.py
│   │   ├── ai.py
│   │   ├── auth.py
│   │   ├── educator.py
│   │   └── career.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── content_processor.py
│   │   ├── ai_service.py
│   │   ├── bkt_service.py
│   │   ├── analytics.py
│   │   └── career_mapper.py
│   └── utils/
│       ├── __init__.py
│       ├── pdf_extractor.py
│       ├── doc_extractor.py
│       ├── ocr_processor.py
│       └── youtube_extractor.py
├── requirements.txt
└── .env
```

## ✅ Day 1 Tasks (Hours 0-12)

### Hour 0-3: Setup
- [x] Create backend directory
- [ ] Setup virtual environment
- [ ] Install all dependencies
- [ ] Create folder structure
- [ ] Setup .env file
- [ ] Create main.py with FastAPI app

### Hour 3-6: Content Processing
- [ ] PDF text extraction endpoint
- [ ] DOC text extraction endpoint
- [ ] Image OCR endpoint (Tesseract)
- [ ] YouTube transcript extraction
- [ ] AI content enhancement (Gemini)

### Hour 6-9: AI Services
- [ ] Gemini API integration
- [ ] Question answering endpoint
- [ ] Quiz generation endpoint
- [ ] Content simplification endpoint
- [ ] Feedback generation endpoint

### Hour 9-12: Educator Dashboard
- [ ] Login/signup for educators
- [ ] Student list view
- [ ] Analytics charts (progress, scores)
- [ ] Content assignment system
- [ ] Export reports

## ✅ Day 2 Tasks (Hours 13-24)

### Hour 13-15: AI Q&A
- [ ] Semantic search implementation
- [ ] Source-grounded answers
- [ ] Citation extraction
- [ ] Offline extractive summarization

### Hour 15-17: Affective Detection
- [ ] MediaPipe integration (if needed)
- [ ] Facial emotion detection (opt-in)
- [ ] Privacy consent flow
- [ ] Abstract data logging only

### Hour 17-19: Collaborative Features
- [ ] Simple whiteboard integration
- [ ] Peer review workflow
- [ ] Share notebook links

### Hour 19-21: Career Backend
- [ ] Map competencies to O*NET skills
- [ ] Job data integration
- [ ] Salary and outlook data

### Hour 21-24: Deploy
- [ ] Test all endpoints
- [ ] Setup CORS properly
- [ ] Deploy to Render.com
- [ ] Setup CouchDB (Cloudant)

## 🔌 API Endpoints You'll Build

### Content Processing
```python
POST /api/content/upload
POST /api/content/extract-pdf
POST /api/content/extract-doc
POST /api/content/ocr-image
POST /api/content/youtube-transcript
GET /api/content/list
GET /api/content/{id}
```

### AI Services
```python
POST /api/ai/enhance
POST /api/ai/question
POST /api/ai/quiz
POST /api/ai/feedback
POST /api/ai/simplify
```

### Authentication
```python
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/me
```

### Educator
```python
GET /api/educator/students
GET /api/educator/analytics/{student_id}
POST /api/educator/assign-content
GET /api/educator/export-report
```

### Career
```python
GET /api/career/recommendations
GET /api/career/skills-gap
GET /api/career/jobs
```

### Progress
```python
POST /api/progress/save
GET /api/progress/{user_id}
GET /api/progress/competency/{competency_id}
```

## 🔥 Critical Files to Create

### 1. main.py
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import content, ai, auth, educator, career

app = FastAPI(title="AI Learning Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(educator.router, prefix="/api/educator", tags=["educator"])
app.include_router(career.router, prefix="/api/career", tags=["career"])

@app.get("/")
def root():
    return {"message": "AI Learning Platform API"}
```

### 2. requirements.txt
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
google-generativeai==0.3.1
PyPDF2==3.0.1
python-docx==1.1.0
pytesseract==0.3.10
Pillow==10.1.0
youtube-transcript-api==0.6.1
python-multipart==0.0.6
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
```

### 3. config.py
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    DATABASE_URL: str = "sqlite:///./app.db"
    COUCHDB_URL: str = ""
    SECRET_KEY: str = "your-secret-key-change-in-production"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

## 🚀 Deployment to Render.com

1. Create `render.yaml`:
```yaml
services:
  - type: web
    name: ai-learning-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: GEMINI_API_KEY
        sync: false
      - key: DATABASE_URL
        sync: false
```

2. Push to GitHub
3. Connect Render to your repo
4. Deploy!

## 💡 Tips

- Use FastAPI's automatic docs at `/docs`
- Test endpoints with Postman or Thunder Client
- Keep Gemini API calls efficient (cache when possible)
- Handle errors gracefully
- Log important events
- Commit often to your branch

## 🆘 Need Frontend Integration?

Coordinate with Dev 1 for:
- API response formats
- Error handling
- Authentication flow
- File upload formats

## 📝 Git Commands

```bash
# Your branch
git checkout -b dev2-backend

# Commit your work
git add backend/
git commit -m "feat(backend): description"

# Push
git push origin dev2-backend
```

## 🔐 Environment Variables

Create `.env` in `backend/`:
```
GEMINI_API_KEY=your_actual_api_key_here
DATABASE_URL=sqlite:///./app.db
COUCHDB_URL=https://your-cloudant-url.cloudant.com
COUCHDB_USER=your_username
COUCHDB_PASSWORD=your_password
SECRET_KEY=generate-a-secure-random-key
```

Good luck! 🚀
