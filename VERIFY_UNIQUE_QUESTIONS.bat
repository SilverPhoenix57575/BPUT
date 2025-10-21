@echo off
echo ========================================
echo Quiz Generation Verification
echo ========================================
echo.
echo Your backend is running on: http://127.0.0.1:8000
echo.
echo TO VERIFY UNIQUE QUESTIONS:
echo ========================================
echo.
echo 1. Open frontend: http://localhost:5173
echo 2. Press F12 to open Developer Console
echo 3. Go to Quiz section
echo 4. Generate a quiz on "Python"
echo.
echo WHAT TO CHECK:
echo ========================================
echo.
echo IN BROWSER CONSOLE (F12):
echo   - Look for: "Sending quiz request to API..."
echo   - Look for: "Gemini generated content"
echo   - Look for: "Successfully parsed X questions"
echo.
echo IN BACKEND TERMINAL (this window):
echo   - Look for: "QUIZ GENERATION REQUEST RECEIVED"
echo   - Look for: "CALLING GEMINI API"
echo   - Look for: "GEMINI RESPONSE RECEIVED"
echo   - Note the Session ID (e.g., Session: 1234-1234567890)
echo.
echo VERIFY UNIQUENESS:
echo ========================================
echo.
echo 1. Take the quiz
echo 2. Click "Take Another Quiz"
echo 3. Generate another quiz on "Python" with same settings
echo 4. Check backend logs - Session ID should be DIFFERENT
echo 5. Questions should be DIFFERENT
echo.
echo ========================================
echo.
echo Press any key to open test documentation...
pause > nul
start TEST_QUIZ_GENERATION.md
