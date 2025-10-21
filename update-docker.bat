@echo off
echo ========================================
echo   Updating Docker Containers
echo ========================================
echo.

echo [1/4] Stopping containers...
docker-compose down

echo.
echo [2/4] Removing old images...
docker-compose rm -f

echo.
echo [3/4] Building fresh images (no cache)...
docker-compose build --no-cache

echo.
echo [4/4] Starting containers...
docker-compose --env-file .env.docker up -d

echo.
echo ========================================
echo   ✓ Update Complete!
echo ========================================
echo.
echo Frontend: http://localhost
echo Backend:  http://localhost:8000
echo.
echo To view logs: docker-compose logs -f
echo.
pause
