# 📊 Tracking & Analytics Feature

## Overview
Complete implementation of student dashboard and parental analytics with comprehensive tracking of learning activities.

---

## ✅ Features Implemented

### 1. Student Dashboard
- **Welcome Screen**: Personalized greeting with user name
- **Usage Stats Card**:
  - Time spent studying "Today"
  - Time spent studying "This Week"
- **Activity Summary Card**:
  - Notes generated count
  - Flashcards created count
  - Quizzes taken count

### 2. Parental Analytics Dashboard
- **Study Activity Summary**: Bar chart showing:
  - Notes generated
  - Flashcards generated
  - Quizzes taken
  
- **Weekly Study Time**: Line graph showing:
  - Study duration for each day of the week
  - Visual bar chart with minutes per day
  
- **Streak Progress**: 
  - Current study streak in days
  - Tracks consecutive days of learning
  
- **Topic Accuracy**: 
  - Progress bars for each topic
  - Color-coded by performance (green ≥70%, yellow ≥50%, red <50%)
  - Shows mastery percentage per competency
  
- **Achievements Overview**:
  - Total badges earned
  - Badge names and earned dates

---

## 🗂️ Files Created/Modified

### Backend Files
1. **`backend/app/models.py`** - Added:
   - `StudySession` model (tracks activity type, topic, duration, score)
   - `Achievement` model (tracks badges earned)

2. **`backend/app/routers/analytics.py`** - NEW:
   - `POST /api/analytics/session` - Log study sessions
   - `GET /api/analytics/dashboard/{user_id}` - Get dashboard stats
   - `GET /api/analytics/parental/{user_id}` - Get parental analytics
   - `POST /api/analytics/achievement` - Award achievements

3. **`backend/app/main.py`** - Modified:
   - Registered analytics router

### Frontend Files
1. **`frontend/src/components/student/Dashboard.jsx`** - NEW:
   - Student dashboard with usage stats
   - Time tracking (today/week)
   - Activity counts

2. **`frontend/src/components/student/ParentalAnalytics.jsx`** - NEW:
   - Comprehensive analytics dashboard
   - Multiple chart components
   - Activity summary, weekly chart, streak, topic accuracy

3. **`frontend/src/services/analytics.js`** - NEW:
   - `logStudySession()` - Log activities
   - `awardAchievement()` - Award badges

4. **`frontend/src/stores/analyticsStore.js`** - NEW:
   - Session timing management
   - Start/end session tracking
   - Duration calculation

5. **`frontend/src/App.jsx`** - Modified:
   - Added Dashboard and Analytics navigation buttons
   - Integrated new views into routing

6. **`frontend/src/components/student/QuizView.jsx`** - Modified:
   - Integrated session tracking
   - Logs quiz completion with duration and score

7. **`frontend/src/components/hub/ContentImporter.jsx`** - Modified:
   - Logs note creation activities

---

## 🚀 How to Use

### Access Dashboard
1. Login to the application
2. Click **"Dashboard"** button in navigation
3. View your daily and weekly stats

### Access Analytics
1. Click **"Analytics"** button in navigation
2. View comprehensive learning analytics:
   - Study activity summary
   - Weekly study time graph
   - Current streak
   - Topic accuracy breakdown
   - Achievements earned

### Automatic Tracking
The system automatically tracks:
- **Quiz Sessions**: Duration and score when completing quizzes
- **Note Creation**: When saving notes to notebook/library
- **Study Time**: Accumulated across all activities

---

## 📊 Data Tracked

### Study Sessions
- User ID
- Activity Type (note, flashcard, quiz)
- Topic/Subject
- Duration (seconds)
- Score (for quizzes)
- Timestamp

### Achievements
- User ID
- Badge ID
- Badge Name
- Earned Date

### Progress
- Competency mastery levels
- Topic accuracy percentages
- Interaction history

---

## 🎨 UI Components

### Dashboard Cards
- **Gradient Icons**: Blue-cyan for time, purple-pink for activities
- **Large Numbers**: Prominent display of key metrics
- **Responsive Layout**: 2-column grid on desktop

### Analytics Charts
- **Bar Chart**: Study activity summary with color-coded bars
- **Line Graph**: Weekly study time with day labels
- **Progress Bars**: Topic accuracy with color indicators
- **Stat Cards**: Streak and achievements with large numbers

---

## 🔧 API Endpoints

### Log Study Session
```http
POST /api/analytics/session
Content-Type: application/json

{
  "userId": "user_123",
  "activityType": "quiz",
  "topic": "Data Structures",
  "duration": 300,
  "score": 85.5
}
```

### Get Dashboard Stats
```http
GET /api/analytics/dashboard/{user_id}

Response:
{
  "timeToday": 1800,
  "timeWeek": 7200,
  "notesCount": 15,
  "flashcardsCount": 45,
  "quizzesCount": 8
}
```

### Get Parental Analytics
```http
GET /api/analytics/parental/{user_id}

Response:
{
  "activitySummary": {
    "notes": 15,
    "flashcards": 45,
    "quizzes": 8
  },
  "weeklyStudyTime": [
    {"day": "Mon", "minutes": 45},
    {"day": "Tue", "minutes": 60},
    ...
  ],
  "streak": 7,
  "topicAccuracy": [
    {"topic": "cs_001", "accuracy": 85.5},
    ...
  ],
  "achievements": [
    {"name": "Quiz Master", "earnedAt": "2024-01-15T10:30:00"}
  ]
}
```

### Award Achievement
```http
POST /api/analytics/achievement?user_id=user_123&badge_id=quiz_master&badge_name=Quiz%20Master
```

---

## 🎯 Future Enhancements

- Real-time activity tracking
- Flashcard session tracking
- Detailed time-per-topic breakdown
- Comparison with peer averages
- Export analytics reports
- Parent email notifications
- Goal setting and tracking
- Custom achievement creation

---

## 🧪 Testing

### Test Dashboard
1. Complete a quiz
2. Create a note
3. Navigate to Dashboard
4. Verify stats are updated

### Test Analytics
1. Complete multiple activities over several days
2. Navigate to Analytics
3. Verify:
   - Activity counts are correct
   - Weekly chart shows data
   - Streak is calculated
   - Topic accuracy displays

### Test Session Logging
1. Open browser console
2. Complete a quiz
3. Check network tab for POST to `/api/analytics/session`
4. Verify data is sent correctly

---

## 📝 Notes

- All times are stored in seconds in the database
- Frontend displays times in hours/minutes format
- Streak calculation checks consecutive days
- Topic accuracy is based on mastery levels (0-1 scale, displayed as 0-100%)
- Charts are responsive and adapt to screen size
- Dark mode compatible with CSS variables

---

**Implementation Complete! ✅**

The Tracking & Analytics feature is fully integrated and ready to use.
