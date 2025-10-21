# 🚀 AI Learning Platform

**Cognitively-aware, offline-first AI learning assistant for Computer Science students**

---

## 🚨 FIRST TIME SETUP?

⚠️ **CRITICAL SECURITY FIXES REQUIRED**

1. **IMMEDIATE**: Run `fix-security.bat` to remove sensitive files from Git
2. Run `setup-security.bat` to generate secure keys
3. Update `.env.docker` and `backend/.env` with your Gemini API key
4. Read [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) for details
5. Run `python verify-security.py` to verify

---

## ⚡ Quick Start (Choose One)

### Option 1: Docker (Recommended - No Setup Required)
```bash
# Windows: Double-click start-docker.bat
# Or run:
docker-compose --env-file .env.docker up --build
```
**Access:** http://localhost

### After Git Pull (Update Changes)
```bash
# Windows: Double-click update-docker.bat
# Or run:
docker-compose down
docker-compose build --no-cache
docker-compose --env-file .env.docker up
```

### Option 2: Manual Setup
```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── deployment/       # Docker & Kubernetes files
└── docs/            # Documentation
```

---

## 📚 Documentation

- **[Backend Setup](backend/README.md)** - Backend installation & API docs
- **[Frontend Setup](frontend/README.md)** - Frontend installation & features
- **[Docker Setup](deployment/docker/README.md)** - Docker Compose guide
- **[Kubernetes Setup](deployment/kubernetes/README.md)** - K8s deployment guide
- **[API Documentation](docs/API.md)** - API endpoints reference

---

## 🎯 Features

✅ AI-powered Q&A (Gemini API)  
✅ Adaptive learning (Bayesian Knowledge Tracing)  
✅ Multi-format content (PDF, DOC, Images, YouTube)  
✅ Progress tracking & gamification  
✅ Career pathway mapping  
✅ Offline-first architecture  
✅ Docker & Kubernetes ready  

---

## 🔑 Environment Setup

⚠️ **SECURITY FIRST**: Read [SECURITY_SETUP.md](SECURITY_SETUP.md) before proceeding!

Create `.env.docker` in root:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
SECRET_KEY=your-secure-jwt-key-min-32-chars
```

**Generate secure SECRET_KEY:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 🆘 Need Help?

- Backend issues: See `backend/README.md`
- Frontend issues: See `frontend/README.md`
- Docker issues: See `deployment/docker/README.md`
- Kubernetes issues: See `deployment/kubernetes/README.md`

---

## 🎉 Tech Stack

**Backend:** FastAPI, SQLAlchemy, Gemini API  
**Frontend:** React, Vite, TailwindCSS, Zustand  
**Deployment:** Docker, Kubernetes, Nginx  

---

**Made with ❤️ for BPUT Hackathon**
