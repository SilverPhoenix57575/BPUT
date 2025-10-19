# 🚀 Quick Start for Dev 2 (Backend)

## ⚡ 5-Minute Setup

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Configure Environment
```bash
copy .env.example .env
notepad .env
```

Add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

### Step 4: Start Server
```bash
uvicorn app.main:app --reload
```

### Step 5: Test
Open browser: http://localhost:8000/docs

## ✅ You're Done!

### What You Have:
- ✅ 20+ API endpoints ready
- ✅ AI integration (Gemini)
- ✅ Content processing (PDF, DOC, Image, YouTube)
- ✅ File storage (local uploads/)
- ✅ Authentication system
- ✅ Progress tracking (BKT algorithm)
- ✅ Career mapping
- ✅ Educator dashboard
- ✅ Complete documentation

### Test File Upload:

1. Go to http://localhost:8000/docs
2. Try POST /api/content/upload
3. Click "Try it out"
4. Upload a PDF file
5. Get response with fileUrl
6. Access file at: http://localhost:8000/uploads/filename

## 📚 Next Steps

1. **Read**: `backend/README.md` - Full setup guide
2. **Storage**: `backend/STORAGE_INFO.md` - How files are stored
3. **Test**: `backend/TESTING.md` - Testing guide
4. **Check**: `backend/DEV2_CHECKLIST.md` - Development checklist

## 🎯 Your Workspace

```
backend/          ← Your territory (Dev 2)
├── app/
│   ├── routers/      ← API endpoints
│   ├── services/     ← Business logic
│   ├── utils/        ← Helper functions
│   └── main.py       ← FastAPI app
├── uploads/          ← Uploaded files
└── requirements.txt
```

## 🚫 Don't Touch

```
frontend/         ← Dev 1's territory
```

## 💡 Pro Tips

1. **Use the docs**: http://localhost:8000/docs is your best friend
2. **Test uploads**: Try uploading PDF, DOC, images
3. **Check uploads/**: See your uploaded files
4. **Commit frequently**: Small, focused commits
5. **Stay in backend/**: Avoid merge conflicts

## 🆘 Issues?

### Server won't start?
```bash
cd backend
venv\Scripts\activate
pip install -r requirements.txt
```

### Gemini API error?
- Check your API key in `.env`
- Get a new key: https://ai.google.dev/

## 🎉 Ready to Code!

Everything is set up. Focus on building amazing features!

**Good luck! 🚀**
