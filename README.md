# 🚀 AI Learning Platform - Hackathon Project

**Cognitively-aware, offline-first AI learning assistant for Computer Science students**

## 🎯 Quick Start

### Dev 1 (Frontend) - Setup
```bash
cd frontend
npm install
npm run dev
```

### Dev 2 (Backend) - Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 🔑 Environment Setup

### Frontend (.env in frontend/)
```
VITE_API_URL=http://localhost:8000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Backend (.env in backend/)
```
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your-secret-key
```

## 📂 Project Structure

```
├── frontend/          # Dev 1 works here
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── stores/
│   └── package.json
│
├── backend/           # Dev 2 works here
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   └── utils/
│   └── requirements.txt
│
└── docs/
```

## 🚫 Merge Conflict Prevention

### Dev 1 (Frontend) - Your Files
- `frontend/**/*` - All frontend files
- `docs/FRONTEND_GUIDE.md`

### Dev 2 (Backend) - Your Files
- `backend/**/*` - All backend files
- `docs/BACKEND_GUIDE.md`

### Shared Files (Coordinate before editing)
- `README.md`
- `COMPLETE_HACKATHON_ROADMAP.md`
- `docs/API_DOCS.md`

## 🔄 Git Workflow

```bash
# Pull latest changes before starting work
git pull origin main

# Create your feature branch
git checkout -b dev1-feature-name  # Dev 1
git checkout -b dev2-feature-name  # Dev 2

# Commit your changes
git add .
git commit -m "feat: description"

# Push your branch
git push origin your-branch-name

# Create Pull Request on GitHub
```

## 📋 Development Checklist

See `COMPLETE_HACKATHON_ROADMAP.md` for detailed tasks.

## 🆘 Need Help?

- Frontend issues: Ask Dev 1
- Backend issues: Ask Dev 2
- Integration: Discuss together

## 🎉 Let's Build Something Amazing!
