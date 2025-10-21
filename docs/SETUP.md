# 📖 Complete Setup Guide

## Prerequisites

- **Docker:** https://www.docker.com/products/docker-desktop/
- **Python 3.11+** (for manual setup)
- **Node.js 18+** (for manual setup)

---

## Option 1: Docker (Recommended)

### Windows
1. Double-click `start-docker.bat`
2. Open http://localhost

### Command Line
```bash
docker-compose --env-file .env.docker up --build
```

---

## Option 2: Manual Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create `.env.docker` in root:
```env
GEMINI_API_KEY=your_gemini_api_key
SECRET_KEY=your_secret_key
```

Get Gemini API key: https://makersuite.google.com/app/apikey

---

## Verification

- Frontend: http://localhost (Docker) or http://localhost:5173 (Manual)
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

Test:
1. Create account
2. Upload a file
3. Ask AI a question
4. Take a quiz

---

## Troubleshooting

### Docker not starting
- Ensure Docker Desktop is running
- Check ports 80 and 8000 are free

### Backend errors
- Check `.env` file exists with API key
- Verify Python 3.11+ installed

### Frontend errors
- Run `npm install` again
- Clear cache: `rm -rf node_modules package-lock.json`

---

## Next Steps

- Read [API Documentation](API.md)
- Check [Backend README](../backend/README.md)
- Check [Frontend README](../frontend/README.md)
