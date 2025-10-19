# 🔌 API Contract - Frontend ↔️ Backend

## 🎯 Purpose
This document defines the API contract between Dev 1 (Frontend) and Dev 2 (Backend).
Both developers should agree on these formats before implementation.

---

## 📤 Content Endpoints

### Upload Content
```http
POST /api/content/upload
Content-Type: multipart/form-data

Request:
{
  "file": <binary>,
  "type": "pdf" | "doc" | "image" | "youtube",
  "userId": "string"
}

Response: 200 OK
{
  "id": "content_123",
  "filename": "lecture.pdf",
  "type": "pdf",
  "extractedText": "...",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Content List
```http
GET /api/content/list?userId=user_123

Response: 200 OK
{
  "contents": [
    {
      "id": "content_123",
      "filename": "lecture.pdf",
      "type": "pdf",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 🤖 AI Endpoints

### Enhance Content
```http
POST /api/ai/enhance
Content-Type: application/json

Request:
{
  "text": "Complex technical content...",
  "level": "beginner" | "intermediate" | "advanced"
}

Response: 200 OK
{
  "enhancedText": "Simplified content...",
  "readabilityScore": 8.5
}
```

### Ask Question
```http
POST /api/ai/question
Content-Type: application/json

Request:
{
  "question": "What is recursion?",
  "contentId": "content_123",
  "userId": "user_123"
}

Response: 200 OK
{
  "answer": "Recursion is...",
  "citations": [
    {
      "source": "lecture.pdf",
      "page": 5,
      "text": "..."
    }
  ],
  "confidence": 0.92
}
```

### Generate Quiz
```http
POST /api/ai/quiz
Content-Type: application/json

Request:
{
  "contentId": "content_123",
  "competencyId": "cs_001",
  "numQuestions": 5
}

Response: 200 OK
{
  "questions": [
    {
      "id": "q1",
      "question": "What is a variable?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "..."
    }
  ]
}
```

---

## 📊 Progress Endpoints

### Save Progress
```http
POST /api/progress/save
Content-Type: application/json

Request:
{
  "userId": "user_123",
  "competencyId": "cs_001",
  "interactions": [
    {
      "questionId": "q1",
      "correct": true,
      "timeSpent": 45
    }
  ]
}

Response: 200 OK
{
  "masteryLevel": 0.75,
  "nextRecommendation": "cs_002"
}
```

### Get Progress
```http
GET /api/progress/user_123

Response: 200 OK
{
  "userId": "user_123",
  "masteryLevels": {
    "cs_001": 0.95,
    "cs_002": 0.60,
    "cs_003": 0.30
  },
  "totalInteractions": 150,
  "badges": ["cs_001", "cs_002"]
}
```

---

## 👨‍🏫 Educator Endpoints

### Get Students
```http
GET /api/educator/students?educatorId=edu_123

Response: 200 OK
{
  "students": [
    {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "overallProgress": 0.65
    }
  ]
}
```

### Get Analytics
```http
GET /api/educator/analytics/user_123

Response: 200 OK
{
  "studentId": "user_123",
  "competencyProgress": {
    "cs_001": 0.95,
    "cs_002": 0.60
  },
  "timeSpent": 3600,
  "quizzesCompleted": 15,
  "averageScore": 0.82
}
```

---

## 💼 Career Endpoints

### Get Recommendations
```http
GET /api/career/recommendations?userId=user_123

Response: 200 OK
{
  "recommendations": [
    {
      "career": "Software Developer",
      "match": 85,
      "salary": "$70,000 - $120,000",
      "outlook": "Excellent (22% growth)",
      "skillsNeeded": 3,
      "nextSkills": ["cs_010", "cs_015", "cs_020"]
    }
  ]
}
```

---

## 🔐 Authentication Endpoints

### Signup
```http
POST /api/auth/signup
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "securepass123",
  "role": "student" | "educator"
}

Response: 201 Created
{
  "userId": "user_123",
  "token": "jwt_token_here",
  "role": "student"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "securepass123"
}

Response: 200 OK
{
  "userId": "user_123",
  "token": "jwt_token_here",
  "role": "student"
}
```

---

## ⚠️ Error Responses

All endpoints return errors in this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔄 CORS Configuration

Backend should allow:
```python
allow_origins=["http://localhost:5173", "https://your-frontend.vercel.app"]
allow_methods=["*"]
allow_headers=["*"]
```

---

## 📝 Notes for Developers

### Dev 1 (Frontend)
- Use axios for API calls
- Store token in localStorage
- Handle loading states
- Show error messages to user

### Dev 2 (Backend)
- Validate all inputs
- Return consistent error format
- Log all requests
- Handle file uploads properly

---

## ✅ Testing Checklist

- [ ] All endpoints return correct status codes
- [ ] Error handling works
- [ ] CORS configured properly
- [ ] File uploads work
- [ ] Authentication works
- [ ] Data validation works

---

## 🚀 Integration Steps

1. Dev 2 implements endpoints
2. Dev 2 tests with Postman
3. Dev 2 deploys to Render
4. Dev 1 updates API URL
5. Both test together
6. Fix issues
7. Deploy final version

Good luck! 🎉
