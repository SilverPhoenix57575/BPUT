# 🚀 Complete Setup Instructions

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Git
- Code editor (VS Code recommended)
- Gemini API key (free from Google)

## 🔧 Initial Setup (Both Developers)

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd "By Me and Pratik"
```

### 2. Get API Keys

#### Gemini API (Required)
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Save it securely

#### IBM Cloudant (Optional for demo)
1. Go to https://www.ibm.com/cloud/cloudant
2. Sign up for free tier
3. Create a database
4. Get credentials

### 3. Setup Environment Files

Copy `.env.example` and fill in your keys:
```bash
copy .env.example .env
```

Edit `.env` with your actual values.

## 👨💻 Dev 1 - Frontend Setup

### Step 1: Create Vite Project
```bash
npm create vite@latest frontend -- --template react
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install pouchdb pouchdb-find zustand axios
npm install @tailwindcss/forms lucide-react
npm install onnxruntime-web @mediapipe/face_detection
npm install workbox-webpack-plugin
npm install -D tailwindcss postcss autoprefixer
```

### Step 3: Initialize Tailwind
```bash
npx tailwindcss init -p
```

### Step 4: Create .env
```bash
# frontend/.env
VITE_API_URL=http://localhost:8000
VITE_COUCHDB_URL=your_cloudant_url
VITE_GEMINI_API_KEY=your_key
```

### Step 5: Start Dev Server
```bash
npm run dev
```

Visit http://localhost:5173

## 👨💻 Dev 2 - Backend Setup

### Step 1: Create Backend Directory
```bash
mkdir backend
cd backend
```

### Step 2: Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install fastapi uvicorn sqlalchemy
pip install google-generativeai
pip install PyPDF2 python-docx pytesseract pillow
pip install youtube-transcript-api python-multipart
pip install pydantic-settings python-jose passlib
```

### Step 4: Save Requirements
```bash
pip freeze > requirements.txt
```

### Step 5: Create .env
```bash
# backend/.env
GEMINI_API_KEY=your_key
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your_secret_key
```

### Step 6: Start Server
```bash
uvicorn app.main:app --reload
```

Visit http://localhost:8000/docs

## ✅ Verify Setup

### Frontend Checklist
- [ ] Vite dev server running on port 5173
- [ ] No console errors
- [ ] TailwindCSS working
- [ ] Can import PouchDB

### Backend Checklist
- [ ] FastAPI server running on port 8000
- [ ] /docs page loads
- [ ] Can import all packages
- [ ] Database file created

## 🔄 Git Setup

### Initialize Repository
```bash
git init
git add .
git commit -m "Initial setup"
```

### Create Branches
```bash
# Dev 1
git checkout -b dev1-frontend

# Dev 2
git checkout -b dev2-backend
```

### Push to GitHub
```bash
git remote add origin <your-repo-url>
git push -u origin main
git push -u origin dev1-frontend
git push -u origin dev2-backend
```

## 🆘 Troubleshooting

### Frontend Issues

**Port already in use:**
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <pid> /F
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Backend Issues

**Virtual environment not activating:**
```bash
# Use full path
.\venv\Scripts\activate
```

**Import errors:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Port 8000 in use:**
```bash
uvicorn app.main:app --reload --port 8001
```

## 🎉 Ready to Code!

Once both setups are complete:
1. Dev 1 starts building frontend components
2. Dev 2 starts building backend endpoints
3. Coordinate on API contracts
4. Test integration regularly

Good luck! 🚀
