@echo off
echo ========================================
echo Removing Sensitive Files from Git
echo ========================================
echo.

echo Removing .env files...
git rm --cached .env 2>nul
git rm --cached .env.docker 2>nul
git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul

echo Removing database files...
git rm --cached backend/app.db 2>nul
git rm --cached backend/*.db 2>nul
git rm --cached *.db 2>nul

echo Removing uploaded files...
git rm --cached -r backend/uploads/ 2>nul

echo Removing log files...
git rm --cached backend/logs/app.log 2>nul
git rm --cached backend/*.log 2>nul

echo Removing Kubernetes secrets...
git rm --cached deployment/kubernetes/secret.yaml 2>nul

echo.
echo ========================================
echo Sensitive files removed from Git index
echo ========================================
echo.
echo IMPORTANT: Run the following commands:
echo 1. git add .gitignore
echo 2. git commit -m "Remove sensitive files and update .gitignore"
echo 3. git push
echo.
echo Note: Files are still on disk, only removed from Git tracking
echo ========================================
pause
