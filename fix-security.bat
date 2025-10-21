@echo off
echo 🔐 Fixing Security Issues...

echo.
echo 1. Removing database file from Git...
git rm --cached backend/app.db 2>nul
del "backend\app.db" 2>nul

echo.
echo 2. Removing uploads folder from Git...
git rm -r --cached backend/uploads/ 2>nul
rmdir /s /q "backend\uploads" 2>nul

echo.
echo 3. Removing .env files from Git...
git rm --cached backend/.env 2>nul
git rm --cached .env 2>nul

echo.
echo 4. Creating secure uploads directory...
mkdir "backend\uploads" 2>nul
echo. > "backend\uploads\.gitkeep"

echo.
echo 5. Checking environment files...
if not exist ".env.docker" (
    echo ❌ .env.docker missing - create it with your keys
) else (
    echo ✅ .env.docker exists
)

if not exist "backend\.env" (
    echo ❌ backend/.env missing - create it with your keys
) else (
    echo ✅ backend/.env exists
)

echo.
echo 🔐 Security fixes applied!
echo.
echo ⚠️  NEXT STEPS:
echo 1. Ensure .env.docker has GEMINI_API_KEY and SECRET_KEY
echo 2. Ensure backend/.env has GEMINI_API_KEY and SECRET_KEY  
echo 3. Run: git add .gitignore
echo 4. Run: git commit -m "Fix security vulnerabilities"
echo.
pause