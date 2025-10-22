@echo off
echo ========================================
echo AI Learning Platform - Diagnostics
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Install from https://nodejs.org
    pause
    exit /b 1
)
echo OK
echo.

echo [2/5] Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found!
    pause
    exit /b 1
)
echo OK
echo.

echo [3/5] Checking if node_modules exists...
if exist "node_modules\" (
    echo OK - node_modules found
) else (
    echo WARNING: node_modules not found!
    echo Running npm install...
    npm install
)
echo.

echo [4/5] Checking .env file...
if exist ".env" (
    echo OK - .env file found
    type .env
) else (
    echo WARNING: .env file not found!
    echo Creating .env from .env.example...
    copy .env.example .env
)
echo.

echo [5/5] Checking critical files...
if exist "src\main.jsx" (echo OK - main.jsx found) else (echo ERROR: main.jsx missing!)
if exist "src\App.jsx" (echo OK - App.jsx found) else (echo ERROR: App.jsx missing!)
if exist "index.html" (echo OK - index.html found) else (echo ERROR: index.html missing!)
if exist "vite.config.js" (echo OK - vite.config.js found) else (echo ERROR: vite.config.js missing!)
echo.

echo ========================================
echo Diagnostics Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Open: http://localhost:5173
echo 3. Open browser console (F12) to see logs
echo 4. Look for green checkmarks in console
echo.
pause
