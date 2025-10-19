# AI Learning Platform - Frontend

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit http://localhost:5173

## 📦 What's Built

### ✅ Core Services
- **PouchDB** - Offline storage with sync
- **BKT Algorithm** - Bayesian Knowledge Tracing
- **API Service** - Backend communication

### ✅ State Management (Zustand)
- User store
- Content store
- Progress store
- Competency store

### ✅ Components
- **ContentUpload** - Multi-format file upload
- **LearningInterface** - AI-powered Q&A
- **QuizView** - Interactive quizzes with BKT
- **ProgressDashboard** - Mastery visualization
- **BadgeDisplay** - Gamification badges
- **OfflineIndicator** - Network status

### ✅ Features
- Offline-first architecture
- Real-time progress tracking
- Adaptive learning paths
- Gamification system
- Responsive design

## 🔧 Configuration

Edit `.env`:
```
VITE_API_URL=http://localhost:8000
VITE_COUCHDB_URL=your_cloudant_url
VITE_GEMINI_API_KEY=your_api_key
```

## 📁 Structure

```
src/
├── components/
│   ├── student/        # Student UI
│   ├── gamification/   # Badges, quests
│   └── shared/         # Reusable components
├── services/
│   ├── pouchdb.js      # Offline storage
│   ├── bkt.js          # Knowledge tracing
│   └── api.js          # Backend API
└── stores/             # Zustand stores
```

## 🚀 Build & Deploy

```bash
npm run build
vercel --prod
```

## 💡 Next Steps

1. Add more components (educator dashboard, text friction, etc.)
2. Implement service worker for PWA
3. Add MediaPipe for facial detection
4. Enhance UI/UX
5. Add tests

Built by Dev 1 🎨
