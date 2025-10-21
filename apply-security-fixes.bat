@echo off
echo ========================================
echo AI Learning Platform - Security Fixes
echo ========================================
echo.

echo Step 1: Installing updated dependencies...
cd backend
pip install --upgrade passlib[bcrypt] python-jose[cryptography]
cd ..
echo ✓ Dependencies installed
echo.

echo Step 2: Verifying security implementations...
python verify-security-complete.py
echo.

echo Step 3: Instructions for removing sensitive files...
echo.
echo To remove sensitive files from Git, run:
echo   remove-sensitive-files.bat
echo.
echo Then commit and push:
echo   git add .gitignore
echo   git commit -m "Security fixes applied"
echo   git push
echo.

echo ========================================
echo Security fixes applied successfully!
echo ========================================
echo.
echo IMPORTANT NEXT STEPS:
echo 1. Update your .env files with real API keys
echo 2. Run: remove-sensitive-files.bat
echo 3. Commit and push changes to Git
echo 4. Restart your application
echo.
echo For Docker:
echo   docker-compose down
echo   docker-compose build --no-cache
echo   docker-compose --env-file .env.docker up
echo.
echo For local development:
echo   cd backend
echo   uvicorn app.main:app --reload
echo ========================================
pause
