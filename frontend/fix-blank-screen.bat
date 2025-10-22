@echo off
echo ========================================
echo Fixing Blank Screen Issue
echo ========================================
echo.

echo [1/4] Clearing browser cache data...
echo Please manually:
echo   1. Open browser DevTools (F12)
echo   2. Right-click Refresh button
echo   3. Select "Empty Cache and Hard Reload"
echo.
pause

echo [2/4] Clearing localStorage...
echo Run this in browser console (F12):
echo   localStorage.clear(); sessionStorage.clear(); location.reload();
echo.
pause

echo [3/4] Reinstalling dependencies...
if exist "node_modules\" (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)
if exist "package-lock.json" (
    echo Removing package-lock.json...
    del package-lock.json
)
echo Installing fresh dependencies...
npm install
echo.

echo [4/4] Starting development server...
echo.
echo IMPORTANT: Watch the browser console (F12) for:
echo   - Green checkmarks (✓) = Success
echo   - Red X (✗) = Error
echo.
echo Opening browser console instructions:
echo   Chrome/Edge: Press F12 or Ctrl+Shift+I
echo   Firefox: Press F12 or Ctrl+Shift+K
echo.
pause

npm run dev
