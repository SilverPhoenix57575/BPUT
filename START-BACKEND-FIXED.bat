@echo off
echo ========================================
echo   AI Learning Platform - Backend Start
echo ========================================
echo.

cd backend

echo [1/4] Activating virtual environment...
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
) else (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate.bat
)

echo.
echo [2/4] Installing dependencies...
pip install -q -r requirements.txt

echo.
echo [3/4] Checking Gemini API...
python -c "import google.generativeai as genai; genai.configure(api_key='AIzaSyDAWXzG9uEtgEl4aFt6BZevijg1j6rGzS0'); print('[OK] Gemini API Key Valid')"

echo.
echo [4/4] Starting FastAPI server...
echo.
echo ========================================
echo   Backend running on: http://localhost:8000
echo   API Docs: http://localhost:8000/api/v1/docs
echo ========================================
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
