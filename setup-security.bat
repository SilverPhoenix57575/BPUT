@echo off
echo ========================================
echo  AI Learning Platform - Security Setup
echo ========================================
echo.

echo [1/4] Generating secure SECRET_KEY...
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))" > temp_key.txt
echo.

echo [2/4] Your generated SECRET_KEY:
type temp_key.txt
echo.

echo [3/4] Creating environment files...
if not exist ".env.docker" (
    echo GEMINI_API_KEY=your_gemini_api_key_here > .env.docker
    type temp_key.txt >> .env.docker
    echo ✅ Created .env.docker
) else (
    echo ⚠️  .env.docker already exists
)

if not exist "backend\.env" (
    echo GEMINI_API_KEY=your_gemini_api_key_here > backend\.env
    echo DATABASE_URL=sqlite:///./app.db >> backend\.env
    type temp_key.txt >> backend\.env
    echo ✅ Created backend/.env
) else (
    echo ⚠️  backend/.env already exists
)

echo.
echo [4/4] Next Steps:
echo.
echo 1. Get your Gemini API key from: https://makersuite.google.com/app/apikey
echo 2. Replace 'your_gemini_api_key_here' in both .env files
echo 3. Run fix-security.bat to remove sensitive files from Git
echo 4. NEVER commit .env files to Git!
echo.
echo Read SECURITY_SETUP.md for detailed instructions.
echo.

del temp_key.txt
pause
