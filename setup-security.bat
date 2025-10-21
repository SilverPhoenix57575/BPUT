@echo off
echo ========================================
echo  AI Learning Platform - Security Setup
echo ========================================
echo.

echo [1/3] Generating secure SECRET_KEY...
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(32))" > temp_key.txt
echo.

echo [2/3] Your generated SECRET_KEY:
type temp_key.txt
echo.

echo [3/3] Next Steps:
echo.
echo 1. Get your Gemini API key from: https://makersuite.google.com/app/apikey
echo 2. Update .env.docker with:
echo    - Your Gemini API key
echo    - The SECRET_KEY shown above
echo 3. NEVER commit .env files to Git!
echo.
echo Read SECURITY_SETUP.md for detailed instructions.
echo.

del temp_key.txt
pause
