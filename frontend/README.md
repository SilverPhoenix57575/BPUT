# 🎨 Frontend - React + Vite

## Quick Start

```bash
cd frontend
npm install
npm run build 
npm run dev
```

**Access:** http://localhost:5173

---

## Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/          # SignIn, SignUp
│   │   ├── student/       # Learning components
│   │   ├── gamification/  # Badges
│   │   └── shared/        # Reusable components
│   ├── services/          # API client, storage
│   ├── stores/            # Zustand state
│   ├── App.jsx            # Main app
│   └── main.jsx           # Entry point
├── package.json
└── Dockerfile
```

---

## Environment Variables

Create `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

---

## Features

✅ Authentication (Login/Signup)  
✅ Content upload (PDF, DOC, Images)  
✅ AI chat interface  
✅ Adaptive quizzes  
✅ Progress dashboard  
✅ Badge system  
✅ Offline support (LocalStorage)  

---

## Components

- **ContentUpload** - File upload with drag & drop
- **LearningInterface** - AI chat + content viewer
- **QuizView** - Interactive quizzes
- **ProgressDashboard** - Mastery tracking
- **BadgeDisplay** - Achievements

---

## State Management

Using Zustand:
- `userStore` - Authentication
- `contentStore` - Uploaded content
- `progressStore` - Learning progress
- `competencyStore` - CS curriculum

---

## Build

```bash
npm run build
# Output in dist/
```

---

## Docker

```bash
docker build -t ai-learning-frontend .
docker run -p 80:80 ai-learning-frontend
```

---

## Troubleshooting

### npm install fails
```bash
npm cache clean --force
npm install
```

### Port 5173 in use
```bash
npm run dev -- --port 5174
```

### Backend connection error
Check `VITE_API_URL` in `.env`
