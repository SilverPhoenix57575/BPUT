@echo off
echo ========================================
echo   AI Learning Platform - Quick Start
echo ========================================
echo.

echo [1/3] Starting Backend...
cd backend
start cmd /k "venv\Scripts\activate && uvicorn app.main:app --reload"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend...
cd ..\frontend
start cmd /k "npm run dev"

echo [3/3] Done!
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
pause
