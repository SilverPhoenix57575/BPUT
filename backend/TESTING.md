# Backend Testing Guide

## Quick Test

1. Start the server:
```bash
uvicorn app.main:app --reload
```

2. Visit http://localhost:8000/docs for interactive API documentation

## Manual Testing Checklist

### Health Check
- [ ] GET http://localhost:8000/ - Should return API info
- [ ] GET http://localhost:8000/health - Should return healthy status

### Authentication
- [ ] POST /api/auth/signup - Create test user
  ```json
  {
    "email": "test@example.com",
    "password": "test123",
    "role": "student"
  }
  ```
- [ ] POST /api/auth/login - Login with test user
- [ ] GET /api/auth/me?user_id=USER_ID - Get user info

### Content Upload
- [ ] POST /api/content/upload - Upload a PDF file
- [ ] GET /api/content/list?userId=USER_ID - List uploaded content
- [ ] GET /api/content/CONTENT_ID - Get specific content

### AI Services
- [ ] POST /api/ai/enhance
  ```json
  {
    "text": "Recursion is a programming technique",
    "level": "beginner"
  }
  ```
- [ ] POST /api/ai/question
  ```json
  {
    "question": "What is a variable?",
    "userId": "test_user"
  }
  ```
- [ ] POST /api/ai/quiz
  ```json
  {
    "contentId": "content_123",
    "competencyId": "cs_001",
    "numQuestions": 5
  }
  ```

### Progress Tracking
- [ ] POST /api/progress/save
  ```json
  {
    "userId": "test_user",
    "competencyId": "cs_001",
    "interactions": [
      {"questionId": "q1", "correct": true, "timeSpent": 45}
    ]
  }
  ```
- [ ] GET /api/progress/test_user - Get user progress

### Educator Dashboard
- [ ] GET /api/educator/students?educator_id=edu_123
- [ ] GET /api/educator/analytics/test_user

### Career Mapping
- [ ] GET /api/career/recommendations?user_id=test_user
- [ ] GET /api/career/skills-gap?user_id=test_user&career=Software%20Developer

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"role\":\"student\"}"
```

### Upload Content
```bash
curl -X POST http://localhost:8000/api/content/upload \
  -F "file=@test.pdf" \
  -F "user_id=test_user"
```

### Ask Question
```bash
curl -X POST http://localhost:8000/api/ai/question \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"What is recursion?\",\"userId\":\"test_user\"}"
```

## Common Issues

### Issue: Module not found
**Solution**: Make sure virtual environment is activated and dependencies are installed
```bash
venv\Scripts\activate
pip install -r requirements.txt
```

### Issue: Gemini API error
**Solution**: Check that GEMINI_API_KEY is set in .env file

### Issue: Database error
**Solution**: Delete app.db and restart server to recreate database

### Issue: CORS error from frontend
**Solution**: Check that frontend URL is in CORS allowed origins (currently set to allow all)

## Integration Testing with Frontend

1. Start backend: `uvicorn app.main:app --reload`
2. Start frontend: `npm run dev` (in frontend directory)
3. Test full flow:
   - Signup/Login
   - Upload content
   - Ask questions
   - Take quiz
   - View progress

## Performance Testing

Monitor response times for:
- Content upload: < 2 seconds
- AI enhancement: < 5 seconds
- Quiz generation: < 3 seconds
- Progress save: < 500ms

## Security Checklist

- [ ] Passwords are hashed (bcrypt)
- [ ] SQL injection prevented (SQLAlchemy ORM)
- [ ] CORS configured properly
- [ ] Environment variables used for secrets
- [ ] Input validation on all endpoints
