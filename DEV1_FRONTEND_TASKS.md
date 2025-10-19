# 👨‍💻 Dev 1 - Frontend Development Tasks

## 🎯 Your Responsibility
All files in `frontend/` directory

## ⚡ Quick Setup

```bash
# Create Vite React project
npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install pouchdb pouchdb-find zustand axios
npm install @tailwindcss/forms lucide-react
npm install onnxruntime-web @mediapipe/face_detection
npm install workbox-webpack-plugin
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Start dev server
npm run dev
```

## 📁 File Structure You'll Create

```
frontend/
├── src/
│   ├── components/
│   │   ├── student/
│   │   │   ├── ContentUpload.jsx
│   │   │   ├── LearningInterface.jsx
│   │   │   ├── QuizView.jsx
│   │   │   ├── ProgressDashboard.jsx
│   │   │   └── NotebookWorkspace.jsx
│   │   ├── educator/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudentAnalytics.jsx
│   │   │   └── ContentAssignment.jsx
│   │   ├── adaptive/
│   │   │   ├── TextFrictionMonitor.jsx
│   │   │   ├── FacialDetection.jsx
│   │   │   └── AdaptiveHints.jsx
│   │   ├── gamification/
│   │   │   ├── BadgeDisplay.jsx
│   │   │   ├── QuestTracker.jsx
│   │   │   └── ProgressRing.jsx
│   │   └── shared/
│   │       ├── OfflineIndicator.jsx
│   │       └── LoadingSpinner.jsx
│   ├── services/
│   │   ├── pouchdb.js
│   │   ├── bkt.js
│   │   ├── onnx.js
│   │   ├── mediapipe.js
│   │   └── api.js
│   ├── stores/
│   │   ├── contentStore.js
│   │   ├── userStore.js
│   │   ├── progressStore.js
│   │   └── competencyStore.js
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── service-worker.js
└── package.json
```

## ✅ Day 1 Tasks (Hours 0-12)

### Hour 0-3: Setup
- [x] Create Vite project
- [ ] Install all dependencies
- [ ] Setup TailwindCSS
- [ ] Create folder structure
- [ ] Setup .env file

### Hour 3-6: Offline Architecture
- [ ] Setup PouchDB with IndexedDB
- [ ] Create sync service for CouchDB
- [ ] Implement Service Worker for PWA
- [ ] Build offline indicator component
- [ ] Test offline functionality

### Hour 6-9: BKT Implementation
- [ ] Create Competency Graph data structure
- [ ] Implement BKT algorithm (JavaScript)
- [ ] Build adaptive content recommendation
- [ ] Create learning path visualization
- [ ] Store progress in PouchDB

### Hour 9-12: Student UI
- [ ] Home page with content upload
- [ ] Library view (all content)
- [ ] Learning interface (content + chat)
- [ ] Quiz component
- [ ] Progress dashboard

## ✅ Day 2 Tasks (Hours 13-24)

### Hour 13-15: NotebookLM Features
- [ ] Multi-format upload (drag & drop)
- [ ] Notebook organization
- [ ] Source viewer (PDF, text, images)
- [ ] Citation display component

### Hour 15-17: Text Friction
- [ ] Typing metrics capture (keystrokes, pauses)
- [ ] Baseline pattern detection
- [ ] Cognitive load inference
- [ ] Adaptive hints trigger

### Hour 17-19: Gamification
- [ ] Badge system (tied to competencies)
- [ ] Quest progression
- [ ] Progress bars and levels
- [ ] Achievement notifications

### Hour 19-21: Career UI
- [ ] Career exploration page
- [ ] Skill gap visualization
- [ ] Job recommendations

### Hour 21-24: Polish
- [ ] Mobile responsive fixes
- [ ] Loading states and animations
- [ ] Error handling
- [ ] Deploy to Vercel

## 🔌 API Endpoints You'll Call

```javascript
// Content
POST /api/content/upload
GET /api/content/list
GET /api/content/{id}

// AI
POST /api/ai/enhance
POST /api/ai/question
POST /api/ai/quiz

// Progress
POST /api/progress/save
GET /api/progress/{userId}

// Career
GET /api/career/recommendations
```

## 🎨 UI Components Priority

1. **ContentUpload** - Drag & drop for PDF, DOC, images
2. **LearningInterface** - Main learning view with chat
3. **ProgressDashboard** - Show mastery levels
4. **QuizView** - Interactive quiz component
5. **BadgeDisplay** - Gamification badges

## 🚀 Deployment

```bash
# Build
npm run build

# Deploy to Vercel
npm i -g vercel
vercel --prod
```

## 💡 Tips

- Use Zustand for state management (simpler than Redux)
- Keep components small and focused
- Test offline mode frequently
- Use TailwindCSS for quick styling
- Commit often to your branch

## 🆘 Need Backend Data?

Coordinate with Dev 2 for:
- API endpoint URLs
- Request/response formats
- Authentication tokens
- Test data

## 📝 Git Commands

```bash
# Your branch
git checkout -b dev1-frontend

# Commit your work
git add frontend/
git commit -m "feat(frontend): description"

# Push
git push origin dev1-frontend
```

Good luck! 🚀
