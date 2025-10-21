# Fix 404 Error - Quiz Generation

## Problem
Getting "Request failed with status code 404" when generating quizzes.

## Root Cause
The backend server might not be running, or there's a routing issue.

## Solution Steps

### Step 1: Verify Backend is Running

1. Open a terminal in the project root
2. Check if backend is running:
   ```bash
   netstat -ano | findstr :8000
   ```
   - If you see output, backend is running
   - If no output, backend is NOT running

### Step 2: Start Backend (if not running)

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 3: Test Backend Endpoints

Open `test-backend-connection.html` in your browser and click all test buttons:
- Test 1: Root endpoint (should return success)
- Test 2: Health check (should return healthy)
- Test 3: AI Question endpoint (should work or show specific error)

OR run the batch file:
```bash
test-api-endpoint.bat
```

### Step 4: Check Browser Console

1. Open your app in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Try generating a quiz
5. Look for these logs:
   - "Sending quiz request to API..."
   - "API Base URL: ..."
   - "Request payload: ..."
   - Any error messages

### Step 5: Common Issues & Fixes

#### Issue 1: Backend Not Running
**Symptom**: `netstat` shows nothing on port 8000
**Fix**: Start backend using Step 2

#### Issue 2: Wrong API URL
**Symptom**: Console shows wrong URL (not http://localhost:8000)
**Fix**: Check `frontend/.env` file:
```env
VITE_API_URL=http://localhost:8000
```

#### Issue 3: CORS Error
**Symptom**: Console shows CORS policy error
**Fix**: Backend `main.py` already has CORS configured for localhost:5173

#### Issue 4: Missing Gemini API Key
**Symptom**: Backend returns 500 error
**Fix**: Check `backend/.env` has:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

#### Issue 5: Port Already in Use
**Symptom**: Backend won't start, says port 8000 in use
**Fix**: 
```bash
# Find process using port 8000
netstat -ano | findstr :8000
# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Step 6: Verify Fix

1. Restart frontend: `npm run dev`
2. Try generating a quiz
3. Check console for detailed logs
4. Should work now!

## Quick Test Commands

```bash
# Test root endpoint
curl http://localhost:8000/

# Test health
curl http://localhost:8000/health

# Test AI question endpoint
curl -X POST http://localhost:8000/api/v1/ai/question -H "Content-Type: application/json" -d "{\"question\":\"test\",\"userId\":\"test\"}"
```

## Still Not Working?

1. Check backend terminal for error messages
2. Check frontend console for detailed error logs
3. Verify all environment variables are set
4. Try restarting both frontend and backend
5. Check if antivirus/firewall is blocking port 8000

## Files Modified for Better Debugging

- `frontend/src/components/student/QuizView.jsx` - Added detailed console logging
- `test-backend-connection.html` - Simple HTML test page
- `test-api-endpoint.bat` - Batch script to test endpoints
- `verify-backend-routes.py` - Python script to verify routes

## Contact

If issue persists, check:
1. Backend terminal output
2. Browser console (F12)
3. Network tab in DevTools to see actual request URL
