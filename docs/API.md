# 🔌 API Documentation

## Base URL
- Local: `http://localhost:8000`
- Docker: `http://localhost:8000`

---

## Authentication

### POST /api/auth/signup
Create new account
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student"
}
```

### POST /api/auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## Content

### POST /api/content/upload
Upload file (PDF, DOC, Image)
- Form data with `file` field
- Returns: `{ id, filename, extractedText }`

### GET /api/content/list?userId={userId}
List all content for user

### GET /api/content/{contentId}
Get specific content

---

## AI Services

### POST /api/ai/question
Ask AI question
```json
{
  "question": "What is recursion?",
  "contentId": "content_123",
  "userId": "user_123"
}
```

### POST /api/ai/quiz
Generate quiz
```json
{
  "contentId": "content_123",
  "competencyId": "cs_001",
  "numQuestions": 5
}
```

### POST /api/ai/enhance
Enhance content
```json
{
  "text": "Complex text...",
  "level": "beginner"
}
```

---

## Progress

### POST /api/progress/save
Save learning progress
```json
{
  "userId": "user_123",
  "competencyId": "cs_001",
  "interactions": [{"correct": true}]
}
```

### GET /api/progress/{userId}
Get user progress

---

## Career

### GET /api/career/recommendations?userId={userId}
Get career recommendations

### GET /api/career/skills-gap?userId={userId}&career={career}
Get skills gap analysis

---

## Interactive Docs
Visit: http://localhost:8000/docs
