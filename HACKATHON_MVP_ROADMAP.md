# Hackathon MVP - AI Learning Assistant
## 🎯 Goal: Working Demo in 24-48 Hours

**Team:** 2 Developers  
**Budget:** $0 (Free tier everything)  
**Target:** Computer Science students on mobile/low-end devices  
**Content Source:** YouTube links

---

## 🚀 MINIMAL VIABLE DEMO - What to Build

### Core Features (Must Have)
1. ✅ **Offline-capable PWA** - Works without internet
2. ✅ **YouTube content integration** - Paste link, extract transcript
3. ✅ **AI Q&A** - Ask questions about video content
4. ✅ **Simple quiz generation** - Auto-generate questions
5. ✅ **Progress tracking** - Show what user learned
6. ✅ **Beautiful UI/UX** - Modern, mobile-first design

### Features to SKIP for Hackathon
- ❌ Complex BKT algorithm (too time-consuming)
- ❌ CouchDB sync (use localStorage only)
- ❌ Educator dashboard (focus on student experience)
- ❌ Multimodal detection (too complex)
- ❌ Gamification (nice-to-have, not critical)

---

## 📋 48-Hour Sprint Plan

### Day 1: Foundation (12 hours)

#### Developer 1: Frontend (6-8 hours)
**Hour 0-2: Setup**
- [ ] Create Vite + Vue 3 project
- [ ] Install: TailwindCSS, DaisyUI, Pinia
- [ ] Set up PWA with vite-plugin-pwa
- [ ] Create basic routing (Home, Learn, Quiz, Profile)

**Hour 3-5: UI Components**
- [ ] Design system: colors, typography, spacing
- [ ] Navbar with offline indicator
- [ ] Video card component
- [ ] Question/Answer component
- [ ] Progress bar component

**Hour 6-8: Core Pages**
- [ ] Home: Add YouTube link form
- [ ] Learn: Video player + transcript viewer
- [ ] Quiz: Question display + answer input
- [ ] Profile: Progress dashboard

#### Developer 2: Backend + AI (6-8 hours)
**Hour 0-2: Setup**
- [ ] Create Flask/FastAPI project (lightweight)
- [ ] Set up free hosting: Render.com or Railway.app
- [ ] Configure CORS for frontend

**Hour 3-5: YouTube Integration**
- [ ] Install youtube-transcript-api
- [ ] Endpoint: Extract transcript from YouTube URL
- [ ] Endpoint: Get video metadata (title, duration)
- [ ] Store in SQLite (free, simple)

**Hour 6-8: AI Integration**
- [ ] Use free Gemini API (Google) or Groq API
- [ ] Endpoint: Answer questions about transcript
- [ ] Endpoint: Generate 5 quiz questions from transcript
- [ ] Simple prompt engineering for CS topics

### Day 2: Integration + Polish (12 hours)

#### Both Developers: Integration (4 hours)
**Hour 9-12:**
- [ ] Connect frontend to backend APIs
- [ ] Implement localStorage for offline caching
- [ ] Cache transcripts and questions locally
- [ ] Test offline functionality

#### Developer 1: UI/UX Polish (4 hours)
**Hour 13-16:**
- [ ] Add loading states and animations
- [ ] Implement dark mode toggle
- [ ] Add empty states and error handling
- [ ] Mobile responsive testing
- [ ] Add micro-interactions (button hover, transitions)

#### Developer 2: AI Enhancement (4 hours)
**Hour 13-16:**
- [ ] Improve prompt quality for better answers
- [ ] Add difficulty levels to quiz questions
- [ ] Implement simple scoring system
- [ ] Add "explain answer" feature

#### Both: Final Push (4 hours)
**Hour 17-20:**
- [ ] End-to-end testing on mobile devices
- [ ] Fix critical bugs
- [ ] Deploy frontend to Vercel/Netlify (free)
- [ ] Deploy backend to Render.com (free)
- [ ] Create demo video/screenshots
- [ ] Prepare presentation slides

---

## 🛠️ Tech Stack (All Free)

### Frontend
```
- Vue 3 + Vite (fast, modern)
- TailwindCSS + DaisyUI (beautiful UI, minimal code)
- Pinia (state management)
- vite-plugin-pwa (offline support)
- LocalStorage (offline data)
```

### Backend
```
- FastAPI (Python, fast to build)
- SQLite (no setup needed)
- youtube-transcript-api (free)
- Google Gemini API (free tier: 60 req/min)
  OR Groq API (free tier: very fast)
```

### Hosting (Free Tier)
```
- Frontend: Vercel or Netlify
- Backend: Render.com or Railway.app
- Database: SQLite (file-based, included)
```

### AI APIs (Free Options)
```
Option 1: Google Gemini API
- Free tier: 60 requests/minute
- Sign up: https://makersuite.google.com/app/apikey

Option 2: Groq API (Recommended)
- Free tier: Very fast inference
- Models: Llama 3, Mixtral
- Sign up: https://console.groq.com/

Option 3: Hugging Face Inference API
- Free tier available
- Multiple models
```

---

## 📱 UI/UX Design Guidelines

### Design Inspiration
- **Duolingo** - Gamified, friendly, progress-focused
- **Notion** - Clean, minimal, organized
- **Linear** - Modern, smooth animations
- **Vercel** - Dark mode, gradients, glassmorphism

### Color Palette (CS Theme)
```css
Primary: #6366f1 (Indigo - tech feel)
Secondary: #8b5cf6 (Purple - creativity)
Success: #10b981 (Green - progress)
Background: #0f172a (Dark blue-gray)
Surface: #1e293b (Lighter gray)
Text: #f1f5f9 (Off-white)
```

### Key UI Elements
1. **Gradient backgrounds** - Modern, eye-catching
2. **Glassmorphism cards** - Frosted glass effect
3. **Smooth transitions** - 200-300ms ease-in-out
4. **Micro-interactions** - Button press, card hover
5. **Progress indicators** - Circular progress, streaks
6. **Empty states** - Friendly illustrations
7. **Skeleton loaders** - Better than spinners

### Mobile-First Approach
- Touch targets: minimum 44x44px
- Bottom navigation for easy thumb reach
- Swipe gestures for navigation
- Large, readable fonts (16px minimum)

---

## 🎨 Component Library Setup

### Install Dependencies
```bash
npm create vite@latest ai-learning-app -- --template vue
cd ai-learning-app
npm install
npm install -D tailwindcss postcss autoprefixer daisyui
npm install pinia vue-router
npm install vite-plugin-pwa -D
npm install axios
npx tailwindcss init -p
```

### TailwindCSS Config
```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
      }
    }
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['dark', 'light']
  }
}
```

---

## 🔥 Critical Features Breakdown

### 1. YouTube Transcript Extraction
```python
# backend/youtube_service.py
from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id):
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    full_text = ' '.join([t['text'] for t in transcript])
    return {
        'video_id': video_id,
        'transcript': full_text,
        'duration': transcript[-1]['start']
    }
```

### 2. AI Q&A with Gemini
```python
# backend/ai_service.py
import google.generativeai as genai

genai.configure(api_key='YOUR_API_KEY')
model = genai.GenerativeModel('gemini-pro')

def answer_question(transcript, question):
    prompt = f"""Based on this video transcript about Computer Science:
    
{transcript}

Student Question: {question}

Provide a clear, concise answer (2-3 sentences) suitable for college students."""
    
    response = model.generate_content(prompt)
    return response.text
```

### 3. Quiz Generation
```python
def generate_quiz(transcript):
    prompt = f"""Create 5 multiple-choice questions from this CS lecture:

{transcript}

Format as JSON:
[
  {{
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "..."
  }}
]"""
    
    response = model.generate_content(prompt)
    return response.text
```

### 4. Offline Storage (Frontend)
```js
// src/stores/content.js
import { defineStore } from 'pinia'

export const useContentStore = defineStore('content', {
  state: () => ({
    videos: JSON.parse(localStorage.getItem('videos') || '[]'),
    quizzes: JSON.parse(localStorage.getItem('quizzes') || '{}'),
  }),
  
  actions: {
    addVideo(video) {
      this.videos.push(video)
      localStorage.setItem('videos', JSON.stringify(this.videos))
    },
    
    cacheQuiz(videoId, quiz) {
      this.quizzes[videoId] = quiz
      localStorage.setItem('quizzes', JSON.stringify(this.quizzes))
    }
  }
})
```

---

## 📊 Demo Flow (For Presentation)

### User Journey
1. **Landing Page**
   - Hero section: "Learn CS Anywhere, Even Offline"
   - CTA: "Add Your First Video"

2. **Add Content**
   - Paste YouTube URL (e.g., CS50 lecture)
   - Show loading animation
   - Display: "Transcript extracted! Ready to learn"

3. **Learning Interface**
   - Video player (embedded YouTube)
   - Transcript sidebar (scrollable, timestamped)
   - "Ask a Question" input at bottom

4. **AI Q&A Demo**
   - Ask: "What is recursion?"
   - Show AI typing animation
   - Display answer with source highlighting

5. **Quiz Mode**
   - Click "Test Your Knowledge"
   - Show 5 generated questions
   - Immediate feedback on answers
   - Score display with celebration animation

6. **Offline Demo**
   - Turn off WiFi
   - Show cached content still works
   - Answer questions offline
   - "Will sync when online" indicator

7. **Progress Dashboard**
   - Videos watched: 3
   - Questions answered: 15
   - Quiz score: 85%
   - Streak: 3 days

---

## 🎯 Judging Criteria Focus

### Innovation (25%)
- **AI-powered learning from YouTube** - Novel approach
- **Offline-first for accessibility** - Solves real problem
- **Automatic quiz generation** - Saves time

### Technical Implementation (25%)
- **PWA with offline support** - Advanced web tech
- **AI integration** - Modern ML APIs
- **Responsive design** - Works on all devices

### User Experience (25%)
- **Beautiful, modern UI** - Professional design
- **Smooth interactions** - Polished feel
- **Mobile-optimized** - Primary use case

### Social Impact (25%)
- **Accessibility** - Works offline, low-end devices
- **Education equity** - Free learning for all
- **Scalability** - Can help thousands of students

---

## 🚨 Common Pitfalls to Avoid

1. **Over-engineering** - Keep it simple, working > perfect
2. **Scope creep** - Stick to core features only
3. **API rate limits** - Cache aggressively, test limits
4. **Mobile testing** - Test on real phones early
5. **Deployment issues** - Deploy early, test often
6. **Demo failures** - Have backup videos cached offline

---

## 📦 Deliverables Checklist

### Code
- [ ] GitHub repo with clear README
- [ ] Frontend deployed and live
- [ ] Backend deployed and live
- [ ] Environment variables documented

### Demo Materials
- [ ] 2-minute demo video
- [ ] 5-10 presentation slides
- [ ] Live demo URL
- [ ] Screenshots of key features

### Documentation
- [ ] README with setup instructions
- [ ] Architecture diagram (simple)
- [ ] API documentation (basic)
- [ ] Future roadmap (1 slide)

---

## 🎬 Presentation Script (2 minutes)

**Slide 1: Problem (15s)**
"Students in rural areas struggle with limited internet and lack personalized learning support."

**Slide 2: Solution (15s)**
"We built an AI-powered learning assistant that works offline, turns any YouTube video into an interactive lesson."

**Slide 3: Demo (60s)**
- Add YouTube link → Transcript extracted
- Ask question → AI answers instantly
- Take quiz → Auto-generated from content
- Go offline → Everything still works

**Slide 4: Impact (15s)**
"This enables quality CS education for anyone, anywhere, even with poor connectivity."

**Slide 5: Tech (15s)**
"Built with Vue 3, FastAPI, Gemini AI, and PWA technology for offline support."

---

## 🔧 Quick Start Commands

### Frontend Setup
```bash
npm create vite@latest frontend -- --template vue
cd frontend
npm install
npm install -D tailwindcss daisyui vite-plugin-pwa
npm install pinia vue-router axios
npm run dev
```

### Backend Setup
```bash
mkdir backend && cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn youtube-transcript-api google-generativeai
uvicorn main:app --reload
```

### Deploy
```bash
# Frontend to Vercel
npm run build
vercel --prod

# Backend to Render
# Just connect GitHub repo, auto-deploys
```

---

## 💡 Pro Tips for Hackathon Success

1. **Start with UI mockups** - Agree on design first (30 min)
2. **Use component libraries** - Don't build from scratch
3. **Parallel development** - Frontend/backend simultaneously
4. **Test on mobile early** - Don't wait until the end
5. **Cache everything** - Offline is your differentiator
6. **Have a backup plan** - Pre-record demo if live fails
7. **Practice presentation** - 2-minute pitch is hard
8. **Show, don't tell** - Live demo > slides
9. **Highlight impact** - Focus on helping students
10. **Be confident** - You built something amazing!

---

## 📞 Emergency Resources

### If APIs Fail
- Use mock data (pre-generated responses)
- Have sample transcripts ready
- Pre-cache quiz questions

### If Deployment Fails
- Run locally, screen share
- Use ngrok for quick public URL
- Have video recording as backup

### If Time Runs Out
- Focus on core demo flow
- Skip polish, show functionality
- Explain what you'd add next

---

## 🏆 Winning Strategy

**What Judges Want to See:**
1. ✅ **Working demo** - It actually works
2. ✅ **Clear problem/solution** - Easy to understand
3. ✅ **Technical depth** - Not just a template
4. ✅ **Beautiful UI** - Looks professional
5. ✅ **Social impact** - Helps real people

**Your Unique Selling Points:**
- 🎯 Offline-first (most apps don't work offline)
- 🤖 AI-powered (modern, impressive)
- 📱 Mobile-optimized (practical)
- 🎓 Education focus (positive impact)
- 💰 Free and accessible (scalable solution)

---

**Good luck! You've got this! 🚀**

Remember: A simple, working demo beats a complex, broken one every time.
