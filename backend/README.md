# 🔧 Backend - FastAPI

## Quick Start

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Access:** http://localhost:8000/docs

---

## Structure

```
backend/
├── app/
│   ├── routers/       # API endpoints
│   ├── services/      # Business logic
│   ├── utils/         # Helper functions
│   ├── main.py        # FastAPI app
│   ├── models.py      # Database models
│   └── config.py      # Configuration
├── uploads/           # Uploaded files
├── requirements.txt   # Dependencies
└── Dockerfile         # Docker image
```

---

## Environment Variables

Create `.env` file:
```env
GEMINI_API_KEY=your_api_key
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your_secret_key
```

---

## API Endpoints

- **Content:** Upload, list, get
- **AI:** Question, quiz, enhance
- **Auth:** Signup, login
- **Progress:** Save, get
- **Career:** Recommendations, skills gap
- **Educator:** Students, analytics

Full docs: http://localhost:8000/docs

---

## Features

✅ Multi-format content processing (PDF, DOC, Image, YouTube)  
✅ Gemini AI integration  
✅ Bayesian Knowledge Tracing  
✅ Career pathway mapping  
✅ SQLite database  
✅ File upload system  

---

## Testing

```bash
# Test Gemini API
python test_gemini.py

# Check database
python check_models.py
```

---

## Docker

```bash
docker build -t ai-learning-backend .
docker run -p 8000:8000 ai-learning-backend
```

---

## Troubleshooting

### Module not found
```bash
pip install -r requirements.txt
```

### Port 8000 in use
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Database errors
Delete `app.db` and restart
