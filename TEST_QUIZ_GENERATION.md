# Test Quiz Generation - Step by Step

## ✅ Backend is Running
Your backend is running on http://127.0.0.1:8000

## 🧪 How to Test

### Step 1: Open Frontend
1. Make sure frontend is running: `cd frontend && npm run dev`
2. Open http://localhost:5173 in your browser
3. Navigate to Quiz section

### Step 2: Open Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Keep it open to see logs

### Step 3: Open Backend Terminal
1. Keep your backend terminal visible
2. You should see logs when API is called

### Step 4: Generate First Quiz
1. Enter topic: **"Python"**
2. Select:
   - Difficulty: **Medium**
   - Questions: **5**
   - Type: **Multiple Choice**
3. Click **"Generate Quiz"**

### Step 5: Check Logs

#### Frontend Console Should Show:
```
Sending quiz request to API...
API Base URL: http://localhost:8000
Request payload: {...}
✓ API Response received: {...}
✓ Gemini generated content (first 500 chars): Q: ...
✓ Full content length: 2847 characters
✓ Successfully parsed 5 questions from Gemini
✓ Questions: [...]
```

#### Backend Terminal Should Show:
```
============================================================
🎯 QUIZ GENERATION REQUEST RECEIVED
User: user_123
ContentId: quiz-Python-medium-5
Question length: 1234 chars
Question preview: You are an expert educator creating a UNIQUE quiz about "Python" (Session: 1234-1234567890)...
ResponseType: medium
============================================================
============================================================
🤖 CALLING GEMINI API (medium response)
Prompt length: 1234 chars
============================================================
✅ GEMINI RESPONSE RECEIVED
Response length: 2847 chars
Response preview: Q: What is the purpose of the __init__ method in Python?
A) To initialize class variables
B) To create a new instance
C) To define class methods
D) To import modules
Correct: A
Explanation: ...
============================================================
✅ Gemini API call successful
Response length: 2847 chars
Response preview: Q: What is the purpose of...
============================================================
```

### Step 6: Generate Second Quiz (Same Topic)
1. Click **"Take Another Quiz"**
2. Enter same topic: **"Python"**
3. Keep same settings: Medium, 5, Multiple Choice
4. Click **"Generate Quiz"**

### Step 7: Verify Questions Are Different
- Compare questions from Quiz 1 and Quiz 2
- They should be DIFFERENT questions about Python
- Check console logs - you'll see different Session IDs

### Step 8: Test Different Settings

#### Test A: Different Difficulty
```
Topic: Python
Difficulty: Easy (changed from Medium)
Questions: 5
Type: Multiple Choice

Expected: Easier questions than before
```

#### Test B: Different Question Count
```
Topic: Python
Difficulty: Medium
Questions: 10 (changed from 5)
Type: Multiple Choice

Expected: 10 questions instead of 5
```

#### Test C: Different Question Type
```
Topic: Python
Difficulty: Medium
Questions: 5
Type: True/False (changed from Multiple Choice)

Expected: True/False questions with 2 options
```

#### Test D: Different Topic
```
Topic: Java (changed from Python)
Difficulty: Medium
Questions: 5
Type: Multiple Choice

Expected: Questions about Java, not Python
```

## 🔍 What to Look For

### ✅ Success Indicators

1. **Backend logs show**:
   - 🎯 QUIZ GENERATION REQUEST RECEIVED
   - 🤖 CALLING GEMINI API
   - ✅ GEMINI RESPONSE RECEIVED

2. **Frontend console shows**:
   - ✓ API Response received
   - ✓ Gemini generated content
   - ✓ Successfully parsed X questions

3. **Quiz displays**:
   - Correct number of questions
   - Questions match difficulty level
   - Questions match selected type (MCQ or T/F)
   - Questions are about the topic

4. **Uniqueness**:
   - Each generation has different Session ID in backend logs
   - Questions are different each time for same topic

### ❌ Failure Indicators

1. **No backend logs** → API not being called
2. **Error in console** → Check error message
3. **Same questions** → Check Session ID in logs
4. **Wrong format** → Check parsing logs

## 🐛 Troubleshooting

### Issue: No backend logs
**Solution**: 
- Check backend is running on port 8000
- Check frontend .env has correct API URL
- Check browser Network tab for failed requests

### Issue: Gemini API error
**Solution**:
- Check backend/.env has GEMINI_API_KEY
- Check API key is valid
- Check internet connection

### Issue: Same questions every time
**Solution**:
- Check backend logs for different Session IDs
- If Session IDs are different but questions same, Gemini might be caching
- Try different topics or wait a few seconds between generations

### Issue: Wrong number of questions
**Solution**:
- Check frontend console for parsing warnings
- Check backend logs for full Gemini response
- Gemini might not have generated enough questions

## 📊 Expected Results

### First Quiz (Python, Medium, 5, MCQ)
```
Q1: What is the purpose of the __init__ method?
Q2: Which data structure is used for key-value pairs?
Q3: What does the 'self' parameter represent?
Q4: Which keyword is used for inheritance?
Q5: What is a lambda function?
```

### Second Quiz (Python, Medium, 5, MCQ)
```
Q1: What is list comprehension in Python?
Q2: How do you handle exceptions in Python?
Q3: What is the difference between append() and extend()?
Q4: What are decorators used for?
Q5: What is the purpose of __str__ method?
```

**Notice**: Different questions! ✅

## 🎯 Success Criteria

✅ Backend logs show Gemini API calls  
✅ Frontend console shows successful parsing  
✅ Quiz displays with correct settings  
✅ Questions are unique each time  
✅ Questions match difficulty level  
✅ Questions match selected type  
✅ Questions are about the topic  

---

**If all checks pass, your quiz generation is working perfectly!** 🎉

## Quick Test Command

Run this in a new terminal to test the API directly:
```bash
python test-backend-simple.py
```

This will verify the backend is responding correctly.
