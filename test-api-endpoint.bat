@echo off
echo Testing Backend API Endpoints
echo ==============================
echo.

echo Test 1: Root endpoint
curl -X GET http://localhost:8000/
echo.
echo.

echo Test 2: Health endpoint
curl -X GET http://localhost:8000/health
echo.
echo.

echo Test 3: API v1 AI Question endpoint
curl -X POST http://localhost:8000/api/v1/ai/question ^
  -H "Content-Type: application/json" ^
  -d "{\"question\":\"What is 2+2?\",\"userId\":\"test_user\",\"chatHistory\":[]}"
echo.
echo.

echo Test 4: Legacy AI Question endpoint
curl -X POST http://localhost:8000/api/ai/question ^
  -H "Content-Type: application/json" ^
  -d "{\"question\":\"What is 2+2?\",\"userId\":\"test_user\",\"chatHistory\":[]}"
echo.
echo.

pause
