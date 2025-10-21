@echo off
echo ========================================
echo   AI Learning Platform - Docker Setup
echo ========================================
echo.

echo [1/3] Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop and try again.
    pause
    exit /b 1
)
echo ✓ Docker is running

echo.
echo [2/3] Building and starting containers...
docker-compose --env-file .env.docker up --build -d

if errorlevel 1 (
    echo ERROR: Failed to start containers!
    pause
    exit /b 1
)

echo.
echo [3/3] Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   ✓ Application is running!
echo ========================================
echo.
echo Frontend: http://localhost
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the application
echo.

docker-compose logs -f
