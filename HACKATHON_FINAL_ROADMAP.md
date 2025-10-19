# 🚀 Hackathon MVP - AI Learning Platform
## 48-Hour Build Plan for 2 Developers

**Updated Requirements:**
- ✅ Multi-format content: YouTube, PDF, DOC, Images, Text
- ✅ AI-enhanced readable content
- ✅ Educator dashboard included
- ✅ Offline-first PWA
- ✅ Beautiful UI/UX

---

## 🎯 Core Features

### Student Side
1. **Multi-Source Learning**
   - Upload: PDF, DOC, Images (OCR)
   - Add: YouTube video links
   - Paste: Raw text
   - AI enhances all content for readability

2. **AI Learning Assistant**
   - Ask questions about any content
   - Get explanations in simple language
   - Auto-generate quizzes
   - Track progress

3. **Offline Support**
   - All content cached locally
   - Works without internet
   - Syncs when online

### Educator Side
4. **Teacher Dashboard**
   - View all students' progress
   - See quiz scores and activity
   - Assign content to students
   - Track class performance

---

## 🛠️ Tech Stack (Updated)

### Frontend
```
✅ Vite + React 18 (faster than Vue, better ecosystem)
✅ TailwindCSS + shadcn/ui (beautiful components)
✅ Zustand (simple state management)
✅ React Query (data fetching)
✅ Workbox (PWA/offline)
```

### Backend
```
✅ FastAPI (Python - fast & simple)
✅ SQLite (no setup, file-based)
✅ Gemini API (AI processing)
✅ PyPDF2 (PDF extraction)
✅ python-docx (DOC extraction)
✅ Tesseract OCR (image text extraction)
✅ youtube-transcript-api (video transcripts)
```

### Hosting (Free)
```
✅ Frontend: Vercel (instant deploy)
✅ Backend: Render.com (free tier)
✅ Storage: LocalStorage + SQLite
```

---

## 📋 48-Hour Development Plan

### Day 1: Foundation (12 hours)

#### Developer 1: Frontend (Student App) - 8 hours

**Hour 0-1: Setup**
```bash
npm create vite@latest learning-app -- --template react
cd learning-app
npm install
npm install -D tailwindcss postcss autoprefixer
npm install zustand axios react-router-dom lucide-react
npm install workbox-webpack-plugin workbox-window
npx tailwindcss init -p
```

**Hour 1-3: UI Components**
- [ ] Setup TailwindCSS + shadcn/ui
- [ ] Create layout: Navbar, Sidebar, Main
- [ ] Build content upload component (drag & drop)
- [ ] Create chat interface component
- [ ] Build quiz component

**Hour 3-5: Core Pages**
- [ ] Home: Upload content (multi-format)
- [ ] Library: View all uploaded content
- [ ] Learn: Content viewer + AI chat
- [ ] Quiz: Take tests
- [ ] Profile: Progress tracking

**Hour 5-8: State Management & Offline**
- [ ] Setup Zustand stores (content, user, progress)
- [ ] Implement localStorage caching
- [ ] Add service worker for offline
- [ ] Test offline functionality

#### Developer 2: Backend + AI - 8 hours

**Hour 0-1: Setup**
```bash
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy
pip install google-generativeai youtube-transcript-api
pip install PyPDF2 python-docx pytesseract pillow
pip install python-multipart  # for file uploads
```

**Hour 1-3: Content Processing**
- [ ] Endpoint: Upload PDF → extract text
- [ ] Endpoint: Upload DOC → extract text
- [ ] Endpoint: Upload Image → OCR text
- [ ] Endpoint: YouTube URL → get transcript
- [ ] Endpoint: Enhance text with AI (make readable)

**Hour 3-5: AI Services**
- [ ] Setup Gemini API integration
- [ ] Endpoint: Answer questions about content
- [ ] Endpoint: Generate quiz from content
- [ ] Endpoint: Simplify/enhance text
- [ ] Add prompt engineering for CS topics

**Hour 5-8: Database & Auth**
- [ ] Create SQLite schema (users, content, progress)
- [ ] Simple JWT authentication
- [ ] CRUD endpoints for content
- [ ] Progress tracking endpoints

### Day 2: Integration + Educator Dashboard (12 hours)

#### Developer 1: Educator Dashboard - 6 hours

**Hour 9-11: Dashboard UI**
- [ ] Create educator login/signup
- [ ] Build dashboard layout
- [ ] Student list component
- [ ] Progress visualization (charts)
- [ ] Activity timeline

**Hour 11-14: Dashboard Features**
- [ ] View individual student progress
- [ ] See all quiz scores
- [ ] Content assignment system
- [ ] Class analytics (avg score, completion rate)
- [ ] Export reports (CSV)

#### Developer 2: Backend for Dashboard - 4 hours

**Hour 9-11: Analytics Endpoints**
- [ ] Get all students in class
- [ ] Get student progress data
- [ ] Get quiz statistics
- [ ] Get content engagement metrics

**Hour 11-13: Assignment System**
- [ ] Endpoint: Assign content to students
- [ ] Endpoint: Track assignments
- [ ] Notification system (simple)

#### Both: Final Integration - 6 hours

**Hour 14-17: Connect Everything**
- [ ] Connect frontend to all backend APIs
- [ ] Test file uploads (PDF, DOC, Image)
- [ ] Test YouTube integration
- [ ] Test AI Q&A and quiz generation
- [ ] Test educator dashboard with mock data

**Hour 17-20: Polish & Deploy**
- [ ] Fix critical bugs
- [ ] Add loading states and animations
- [ ] Mobile responsive testing
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render
- [ ] Create demo accounts (student + educator)
- [ ] Record demo video
- [ ] Prepare presentation

---

## 🎨 UI/UX Design System

### Color Palette
```css
/* Modern Education Theme */
--primary: #6366f1      /* Indigo - trust, learning */
--secondary: #8b5cf6    /* Purple - creativity */
--success: #10b981      /* Green - progress */
--warning: #f59e0b      /* Amber - attention */
--danger: #ef4444       /* Red - errors */
--dark: #0f172a         /* Dark blue-gray */
--light: #f1f5f9        /* Off-white */
```

### Key Components
1. **Content Cards** - Glassmorphism effect
2. **Upload Zone** - Drag & drop with animation
3. **Chat Interface** - WhatsApp-style bubbles
4. **Progress Rings** - Circular progress indicators
5. **Dashboard Charts** - Line/bar charts for analytics

---

## 💻 Code Structure

### Frontend Structure
```
learning-app/
├── src/
│   ├── components/
│   │   ├── student/
│   │   │   ├── ContentUpload.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── QuizView.jsx
│   │   │   └── ProgressCard.jsx
│   │   ├── educator/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── StudentList.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AssignContent.jsx
│   │   └── shared/
│   │       ├── Navbar.jsx
│   │       ├── Sidebar.jsx
│   │       └── LoadingSpinner.jsx
│   ├── pages/
│   │   ├── student/
│   │   │   ├── Home.jsx
│   │   │   ├── Library.jsx
│   │   │   ├── Learn.jsx
│   │   │   └── Profile.jsx
│   │   └── educator/
│   │       └── Dashboard.jsx
│   ├── stores/
│   │   ├── contentStore.js
│   │   ├── userStore.js
│   │   └── progressStore.js
│   ├── services/
│   │   ├── api.js
│   │   └── offline.js
│   └── App.jsx
```

### Backend Structure
```
backend/
├── app/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── routers/
│   │   ├── content.py
│   │   ├── ai.py
│   │   ├── auth.py
│   │   └── educator.py
│   ├── services/
│   │   ├── content_processor.py
│   │   ├── ai_service.py
│   │   └── analytics.py
│   └── utils/
│       ├── pdf_extractor.py
│       ├── doc_extractor.py
│       ├── ocr_processor.py
│       └── youtube_extractor.py
```

---

## 🔥 Critical Code Snippets

### 1. Multi-Format Content Upload (Frontend)

```jsx
// components/student/ContentUpload.jsx
import { useState } from 'react'
import { Upload, FileText, Image, Youtube } from 'lucide-react'
import { uploadContent } from '../../services/api'

export default function ContentUpload() {
  const [file, setFile] = useState(null)
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await uploadContent(formData)
      // Cache offline
      localStorage.setItem(`content_${response.id}`, JSON.stringify(response))
      alert('Content uploaded and enhanced!')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleYoutubeSubmit = async () => {
    setLoading(true)
    try {
      const response = await uploadContent({ youtube_url: youtubeUrl })
      localStorage.setItem(`content_${response.id}`, JSON.stringify(response))
      alert('Video transcript extracted!')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Drag & Drop Zone */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop or click to upload
        </p>
        <p className="text-xs text-gray-500">PDF, DOC, Images supported</p>
        <input
          type="file"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded cursor-pointer"
        >
          Choose File
        </label>
      </div>

      {/* YouTube URL Input */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Or paste YouTube URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={handleYoutubeSubmit}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded"
          >
            {loading ? 'Processing...' : 'Add Video'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

### 2. Content Processing (Backend)

```python
# app/services/content_processor.py
import PyPDF2
import docx
import pytesseract
from PIL import Image
from youtube_transcript_api import YouTubeTranscriptApi
import google.generativeai as genai
import re

# ⚠️ NEVER hardcode API keys! Use environment variables
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

class ContentProcessor:
    
    @staticmethod
    def extract_pdf(file_path):
        """Extract text from PDF"""
        text = ""
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text()
        return text
    
    @staticmethod
    def extract_doc(file_path):
        """Extract text from DOC/DOCX"""
        doc = docx.Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    
    @staticmethod
    def extract_image(file_path):
        """Extract text from image using OCR"""
        image = Image.open(file_path)
        text = pytesseract.image_to_string(image)
        return text
    
    @staticmethod
    def extract_youtube(video_url):
        """Extract transcript from YouTube video"""
        # Extract video ID from URL
        video_id = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', video_url)
        if not video_id:
            raise ValueError("Invalid YouTube URL")
        
        video_id = video_id.group(1)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        text = ' '.join([t['text'] for t in transcript])
        return text
    
    @staticmethod
    def enhance_text(raw_text):
        """Use AI to make text more readable and memorable"""
        prompt = f"""Transform this educational content into a clear, memorable format:

Original Content:
{raw_text[:3000]}  # Limit to avoid token limits

Instructions:
1. Break into clear sections with headings
2. Use bullet points for key concepts
3. Add simple examples where helpful
4. Highlight important terms
5. Make it easy to understand for college students
6. Keep it concise but complete

Enhanced Content:"""
        
        response = model.generate_content(prompt)
        return response.text
```

### 3. AI Q&A Service

```python
# app/services/ai_service.py
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

class AIService:
    
    @staticmethod
    def answer_question(content_text, question):
        """Answer student question based on content"""
        prompt = f"""You are a helpful CS tutor. Answer the student's question based on this content.

Content:
{content_text[:4000]}

Student Question: {question}

Provide a clear, concise answer (2-3 sentences) that:
1. Directly answers the question
2. Uses simple language
3. Includes an example if helpful
4. References the content

Answer:"""
        
        response = model.generate_content(prompt)
        return response.text
    
    @staticmethod
    def generate_quiz(content_text, num_questions=5):
        """Generate quiz questions from content"""
        prompt = f"""Create {num_questions} multiple-choice questions from this CS content:

{content_text[:4000]}

Format as JSON array:
[
  {{
    "question": "What is...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
    "correct_index": 0,
    "explanation": "The answer is A because..."
  }}
]

Make questions test understanding, not just memorization."""
        
        response = model.generate_content(prompt)
        # Parse JSON from response
        import json
        try:
            quiz = json.loads(response.text)
            return quiz
        except:
            # Fallback if JSON parsing fails
            return []
    
    @staticmethod
    def simplify_explanation(complex_text):
        """Simplify complex explanations"""
        prompt = f"""Explain this concept in simple terms for a college student:

{complex_text}

Use:
- Simple words
- Short sentences
- Real-world analogies
- Examples

Simplified explanation:"""
        
        response = model.generate_content(prompt)
        return response.text
```

### 4. Educator Dashboard (Frontend)

```jsx
// pages/educator/Dashboard.jsx
import { useState, useEffect } from 'react'
import { getStudents, getClassAnalytics } from '../../services/api'
import { BarChart, Users, TrendingUp, Award } from 'lucide-react'

export default function EducatorDashboard() {
  const [students, setStudents] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [studentsData, analyticsData] = await Promise.all([
        getStudents(),
        getClassAnalytics()
      ])
      setStudents(studentsData)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Educator Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users />}
          title="Total Students"
          value={analytics.total_students}
          color="bg-blue-500"
        />
        <StatCard
          icon={<BarChart />}
          title="Avg Quiz Score"
          value={`${analytics.avg_score}%`}
          color="bg-green-500"
        />
        <StatCard
          icon={<TrendingUp />}
          title="Active Today"
          value={analytics.active_today}
          color="bg-purple-500"
        />
        <StatCard
          icon={<Award />}
          title="Completion Rate"
          value={`${analytics.completion_rate}%`}
          color="bg-orange-500"
        />
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Content Completed</th>
              <th className="text-left py-2">Avg Score</th>
              <th className="text-left py-2">Last Active</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{student.name}</td>
                <td>{student.completed}/{student.total}</td>
                <td>{student.avg_score}%</td>
                <td>{student.last_active}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
                    student.avg_score >= 80 ? 'bg-green-100 text-green-800' :
                    student.avg_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {student.avg_score >= 80 ? 'Excellent' :
                     student.avg_score >= 60 ? 'Good' : 'Needs Help'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
```

### 5. Offline Storage (Frontend)

```javascript
// services/offline.js
class OfflineStorage {
  
  static saveContent(content) {
    const key = `content_${content.id}`
    localStorage.setItem(key, JSON.stringify(content))
  }
  
  static getContent(id) {
    const key = `content_${id}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
  
  static getAllContent() {
    const contents = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('content_')) {
        const data = localStorage.getItem(key)
        contents.push(JSON.parse(data))
      }
    }
    return contents
  }
  
  static saveProgress(userId, contentId, progress) {
    const key = `progress_${userId}_${contentId}`
    localStorage.setItem(key, JSON.stringify(progress))
  }
  
  static getProgress(userId, contentId) {
    const key = `progress_${userId}_${contentId}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
  
  static clearAll() {
    localStorage.clear()
  }
}

export default OfflineStorage
```

---

## 🔐 Environment Variables Setup

### Backend (.env file)
```bash
# ⚠️ NEVER commit this file to Git!
# Add .env to .gitignore

GEMINI_API_KEY=your_new_api_key_here
DATABASE_URL=sqlite:///./learning.db
SECRET_KEY=your-secret-key-for-jwt
```

### Frontend (.env file)
```bash
VITE_API_URL=http://localhost:8000
# For production:
# VITE_API_URL=https://your-backend.render.com
```

---

## 📱 Demo Flow for Presentation

### Student Journey (2 minutes)
1. **Upload Content** (20s)
   - Show drag & drop PDF
   - Paste YouTube link
   - Upload image with text
   - AI enhances all content

2. **Learn with AI** (40s)
   - Open enhanced content
   - Ask question: "Explain recursion simply"
   - AI answers with example
   - Highlight text, get explanation

3. **Take Quiz** (30s)
   - Click "Generate Quiz"
   - Answer 3 questions
   - See instant feedback
   - View score and explanations

4. **Offline Demo** (30s)
   - Turn off WiFi
   - Show content still accessible
   - Answer questions offline
   - "Will sync when online" message

### Educator Journey (1 minute)
5. **Dashboard Overview** (30s)
   - Login as teacher
   - See class statistics
   - View student progress table
   - Identify struggling students

6. **Assign Content** (30s)
   - Select content
   - Assign to specific students
   - Track completion
   - Export report

---

## 🚀 Quick Start Commands

### Frontend Setup
```bash
# Create project
npm create vite@latest learning-app -- --template react
cd learning-app

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npm install zustand axios react-router-dom lucide-react
npm install recharts  # for charts in dashboard
npm install react-dropzone  # for file upload

# Initialize Tailwind
npx tailwindcss init -p

# Run dev server
npm run dev
```

### Backend Setup
```bash
# Create virtual environment
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy
pip install google-generativeai
pip install youtube-transcript-api
pip install PyPDF2 python-docx pytesseract pillow
pip install python-multipart python-jose passlib bcrypt

# Create .env file
echo "GEMINI_API_KEY=your_new_key" > .env

# Run server
uvicorn app.main:app --reload
```

### Deploy
```bash
# Frontend to Vercel
npm run build
npx vercel --prod

# Backend to Render
# 1. Push code to GitHub
# 2. Connect repo on render.com
# 3. Add environment variables
# 4. Auto-deploys!
```

---

## ⚠️ SECURITY CHECKLIST

- [ ] **REGENERATE YOUR GEMINI API KEY** (the one you shared is compromised)
- [ ] Add `.env` to `.gitignore`
- [ ] Never commit API keys to Git
- [ ] Use environment variables for all secrets
- [ ] Add rate limiting to API endpoints
- [ ] Validate all file uploads (size, type)
- [ ] Sanitize user inputs
- [ ] Use HTTPS in production

---

## 🎯 Judging Criteria Alignment

### Innovation (25%)
- ✅ Multi-format content processing (PDF, DOC, Image, YouTube)
- ✅ AI-enhanced readable content
- ✅ Offline-first architecture
- ✅ Dual interface (student + educator)

### Technical Implementation (25%)
- ✅ Modern stack (Vite + React + FastAPI)
- ✅ AI integration (Gemini API)
- ✅ OCR for images
- ✅ PWA with offline support
- ✅ Real-time analytics

### User Experience (25%)
- ✅ Beautiful, modern UI
- ✅ Drag & drop uploads
- ✅ Smooth animations
- ✅ Mobile-responsive
- ✅ Intuitive navigation

### Social Impact (25%)
- ✅ Accessibility (offline, low-end devices)
- ✅ Education equity
- ✅ Teacher empowerment
- ✅ Scalable solution

---

## 💡 Pro Tips

1. **Start with UI mockups** - Agree on design first (30 min)
2. **Use component libraries** - Don't build from scratch
3. **Test file uploads early** - They often have issues
4. **Cache aggressively** - Offline is your superpower
5. **Have demo data ready** - Pre-populate for presentation
6. **Practice the demo** - Know exactly what to show
7. **Backup plan** - Record video if live demo fails
8. **Show impact** - Focus on helping students

---

## 📊 Success Metrics to Highlight

- **Content Processing:** "Supports 4 formats: PDF, DOC, Images, YouTube"
- **AI Enhancement:** "Makes any content readable and memorable"
- **Offline Support:** "100% functional without internet"
- **Educator Tools:** "Track 50+ students in real-time"
- **Speed:** "Generate quiz in 5 seconds"

---

## 🏆 Your Winning Pitch

**Problem:** Students struggle with complex content and teachers can't track progress effectively.

**Solution:** AI-powered platform that:
1. Accepts any content format
2. Makes it readable and memorable
3. Provides instant AI tutoring
4. Works offline
5. Gives teachers real-time insights

**Impact:** Quality education for everyone, everywhere, even offline.

**Tech:** Modern stack with AI, OCR, and PWA technology.

---

## 🚨 IMMEDIATE ACTION ITEMS

1. **RIGHT NOW:** Go to https://makersuite.google.com/app/apikey
   - Delete the exposed key
   - Generate new key
   - Save it securely

2. **Next 30 minutes:**
   - Create project folders
   - Install dependencies
   - Setup Git repo (with .gitignore!)

3. **Start coding:**
   - Dev 1: Frontend setup + UI
   - Dev 2: Backend + content processing

---

**Good luck! You're building something amazing! 🚀**

Remember: Simple & working > Complex & broken
