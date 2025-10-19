# Backend - AI Learning Platform

## Dev 2 Workspace

This directory contains all backend code. Dev 1 should NOT modify files here.

## Quick Setup

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from .env.example)
copy .env.example .env

# Edit .env and add your Gemini API key

# Run server
uvicorn app.main:app --reload
```

## API Documentation

Once running, visit:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## Project Structure

```
backend/
├── app/
│   ├── routers/          # API endpoints
│   │   ├── content.py    # Content upload/management
│   │   ├── ai.py         # AI services
│   │   ├── auth.py       # Authentication
│   │   ├── educator.py   # Educator dashboard
│   │   └── career.py     # Career mapping
│   ├── services/         # Business logic
│   │   ├── content_processor.py
│   │   ├── ai_service.py
│   │   ├── bkt_service.py
│   │   ├── analytics.py
│   │   └── career_mapper.py
│   ├── utils/            # Helper functions
│   │   ├── pdf_extractor.py
│   │   ├── doc_extractor.py
│   │   ├── ocr_processor.py
│   │   └── youtube_extractor.py
│   ├── main.py           # FastAPI app
│   ├── models.py         # Database models
│   ├── database.py       # DB connection
│   └── config.py         # Settings
├── requirements.txt
└── .env
```

## API Endpoints

### Content
- POST /api/content/upload - Upload files
- GET /api/content/list - List all content
- GET /api/content/{id} - Get specific content

### AI
- POST /api/ai/enhance - Enhance content
- POST /api/ai/question - Ask questions
- POST /api/ai/quiz - Generate quiz
- POST /api/ai/feedback - Get feedback
- POST /api/ai/simplify - Simplify content

### Auth
- POST /api/auth/signup - Register user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user

### Educator
- GET /api/educator/students - List students
- GET /api/educator/analytics/{id} - Student analytics
- POST /api/educator/assign-content - Assign content
- GET /api/educator/export-report - Export report

### Career
- GET /api/career/recommendations - Career recommendations
- GET /api/career/skills-gap - Skills gap analysis
- GET /api/career/jobs - Job listings

## Testing

Use the interactive docs at http://localhost:8000/docs to test endpoints.

## Deployment

Deploy to Render.com:
1. Push to GitHub
2. Connect Render to repo
3. Add environment variables
4. Deploy!

## Git Workflow

```bash
# Work on your branch
git checkout -b dev2-feature-name

# Commit changes
git add backend/
git commit -m "feat(backend): description"

# Push
git push origin dev2-feature-name
```

## Notes

- Only modify files in `backend/` directory
- Coordinate with Dev 1 for API contract changes
- Test all endpoints before pushing
- Keep commits focused and descriptive
