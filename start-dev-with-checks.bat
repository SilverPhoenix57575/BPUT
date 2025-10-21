@echo off
echo ========================================
echo AI Learning Platform - Development Start
echo ========================================
echo.

echo [1/5] Checking if backend is already running...
netstat -ano | findstr :8000 > nul
if %errorlevel% equ 0 (
    echo ✓ Backend is already running on port 8000
    echo.
) else (
    echo ✗ Backend is NOT running
    echo.
    echo Starting backend...
    echo.
    start "Backend Server" cmd /k "cd backend && venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
    echo ✓ Backend starting in new window...
    timeout /t 5 /nobreak > nul
    echo.
)

echo [2/5] Checking if frontend is already running...
netstat -ano | findstr :5173 > nul
if %errorlevel% equ 0 (
    echo ✓ Frontend is already running on port 5173
    echo.
) else (
    echo ✗ Frontend is NOT running
    echo.
    echo Starting frontend...
    echo.
    start "Frontend Server" cmd /k "cd frontend && npm run dev"
    echo ✓ Frontend starting in new window...
    timeout /t 3 /nobreak > nul
    echo.
)

echo [3/5] Waiting for servers to start...
timeout /t 5 /nobreak > nul
echo.

echo [4/5] Testing backend connection...
curl -s http://localhost:8000/health > nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Backend is responding
) else (
    echo ✗ Backend is not responding yet (may need more time)
)
echo.

echo [5/5] Opening application...
timeout /t 2 /nobreak > nul
start http://localhost:5173
echo.

echo ========================================
echo ✓ Development environment started!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/api/v1/docs
echo.
echo Press any key to open test page...
pause > nul
start test-backend-connection.html
