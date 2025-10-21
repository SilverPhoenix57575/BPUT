# Test Backend Connection

## 1. Start Backend
```bash
cd backend
uvicorn app.main:app --reload
```

## 2. Test in Browser
Open: http://127.0.0.1:8000

Should see:
```json
{
  "success": true,
  "data": {
    "message": "AI Learning Platform API",
    "version": "1.0.0",
    "status": "running",
    "docs": "/api/v1/docs"
  }
}
```

## 3. Test API Docs
Open: http://127.0.0.1:8000/api/v1/docs

Should see Swagger UI with all endpoints

## 4. Test Question Endpoint
```bash
curl -X POST http://127.0.0.1:8000/api/v1/ai/question ^
  -H "Content-Type: application/json" ^
  -d "{\"question\":\"What is Python?\"}"
```

## If Backend Won't Start:
Check for errors in terminal. Common issues:
- Port 8000 already in use
- Missing .env file
- Import errors in code
