@echo off
echo 🔧 Quick Fix - Installing Dependencies...

echo.
echo Step 1: Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Step 2: Stopping any running containers...
docker-compose down

echo.
echo Step 3: Rebuilding containers...
docker-compose build --no-cache

echo.
echo Step 4: Starting application...
docker-compose --env-file .env.docker up

pause
