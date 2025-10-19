# 🎨 Frontend - AI Learning Platform

## ⚡ Quick Start (3 Minutes)

### 1. Navigate to Frontend
```bash
cd "D:\BPUT Hackathon\By-Me-and-Pratik\frontend"
```

### 2. Install Dependencies
```bash
npm install
```

**Note:** Installation takes 1-2 minutes.

### 3. Run Development Server
```bash
npm run dev
```

✅ **Success!** You should see:
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:5173/
```

### 4. Open in Browser
Visit: **http://localhost:5173**

---

## 🔧 Configuration

The `.env` file connects to the backend:
```env
VITE_API_URL=http://127.0.0.1:8000
```

**Backend must be running on port 8000!** ✨

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # SignIn, SignUp
│   │   ├── student/           # ContentUpload, Learning, Quiz, Progress
│   │   ├── gamification/      # BadgeDisplay
│   │   └── shared/            # LoadingSpinner, OfflineIndicator
│   ├── services/
│   │   ├── api.js             # Axios API client
│   │   ├── bkt.js             # Bayesian Knowledge Tracing
│   │   └── pouchdb.js         # Offline storage
│   ├── stores/
│   │   ├── userStore.js       # User state
│   │   ├── contentStore.js    # Content state
│   │   ├── progressStore.js   # Progress state
│   │   └── competencyStore.js # Competency graph
│   ├── App.jsx                # Main app
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind styles
├── package.json
├── vite.config.js
└── .env
```

---

## 🎯 Features Implemented

### ✅ Authentication
- **SignIn** - Login with backend API
- **SignUp** - Create account with role selection
- **Error handling** - Display API errors
- **Loading states** - Show progress during auth

### ✅ Content Management
- **Upload** - PDF, DOC, images to backend
- **Fallback** - LocalStorage if backend fails
- **Success/Error** - Visual feedback
- **Multi-format** - Support for various file types

### ✅ Learning Interface
- **AI Q&A** - Ask questions about content
- **Quiz** - Adaptive quizzes with BKT
- **Progress** - Track mastery levels
- **Badges** - Gamification system

### ✅ State Management
- **Zustand** - Lightweight state management
- **User store** - Authentication state
- **Content store** - Uploaded content
- **Progress store** - Mastery levels & badges
- **Competency store** - CS curriculum graph

### ✅ Offline Support
- **LocalStorage** - Fallback storage
- **Online/Offline** - Detection
- **Sync** - Ready for backend sync

---

## 🔌 Backend Integration

### API Endpoints Used:
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/content/upload` - File upload
- `GET /api/content/list` - List content
- `POST /api/ai/question` - Ask AI questions
- `POST /api/ai/quiz` - Generate quizzes
- `POST /api/progress/save` - Save progress
- `GET /api/progress/{userId}` - Get progress
- `GET /api/career/recommendations` - Career matches

### Connection Status:
✅ API client configured
✅ Authentication connected
✅ Content upload connected
✅ AI services connected
✅ Progress tracking connected
✅ Error handling implemented
✅ Loading states implemented

---

## 🧪 Testing the App

### 1. Start Backend First
```bash
cd ../backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

### 2. Start Frontend
```bash
cd ../frontend
npm run dev
```

### 3. Test Flow
1. Open http://localhost:5173
2. Click "Sign Up"
3. Create account (any email/password)
4. Upload a PDF file
5. Navigate to "Learn" tab
6. Ask AI a question
7. Take a quiz
8. Check progress dashboard

---

## 🐛 Troubleshooting

### ❌ "Cannot connect to backend"
**Problem:** Backend not running

**Solution:**
```bash
cd ../backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

### ❌ "npm install" fails
**Problem:** Node.js version or network

**Solution:**
```bash
# Clear cache
npm cache clean --force
npm install
```

### ❌ Port 5173 already in use
**Problem:** Another Vite server running

**Solution:**
```bash
# Kill process
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 5174
```

### ❌ "Module not found" errors
**Problem:** Dependencies not installed

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🔄 Development Workflow

### Daily Startup
```bash
cd "D:\BPUT Hackathon\By-Me-and-Pratik\frontend"
npm run dev
```

### Making Changes
1. Edit files in `src/` directory
2. Vite auto-reloads (instant)
3. Check browser console for errors

### Adding New Components
1. Create in `src/components/`
2. Import in `App.jsx`
3. Add to navigation if needed

---

## 📦 Key Dependencies

- **React 18** - UI library
- **Vite** - Build tool (fast!)
- **TailwindCSS** - Styling
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons
- **PouchDB** - Offline storage (optional)

---

## 🎨 UI Components

### Navigation
- Home, Upload, Learn, Quiz, Progress, Badges
- Gradient design with smooth transitions
- Responsive mobile menu

### Auth Pages
- Beautiful gradient backgrounds
- Form validation
- Error messages
- Loading states

### Content Upload
- Drag & drop interface
- File type icons
- Success/error feedback
- Progress indicators

### Learning Interface
- Split view (content + AI chat)
- Real-time Q&A
- Citation display
- Smooth animations

### Quiz View
- Multiple choice questions
- Instant feedback
- Explanation display
- Progress tracking

### Progress Dashboard
- Mastery level bars
- Color-coded progress
- Competency prerequisites
- Visual charts

### Badge Display
- Earned badges grid
- Animated icons
- Achievement descriptions
- Gradient cards

---

## 🚀 Build for Production

```bash
npm run build
```

Output in `dist/` folder ready for deployment.

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
```

### Environment Variables
Set in deployment platform:
```
VITE_API_URL=https://your-backend-url.com
```

---

## ✅ Integration Checklist

- ✅ Backend API URL configured
- ✅ Authentication endpoints connected
- ✅ Content upload working
- ✅ AI services integrated
- ✅ Progress tracking functional
- ✅ Error handling implemented
- ✅ Loading states added
- ✅ Offline fallback ready
- ✅ Responsive design
- ✅ Beautiful UI with gradients

---

## 📞 Support

If you encounter issues:
1. Check backend is running on port 8000
2. Verify `.env` file exists
3. Check browser console for errors
4. Ensure npm dependencies installed

**Frontend is ready! Backend must be running.** 🎉
