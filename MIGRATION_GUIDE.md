# 🔄 Migration Guide - Security Updates

## ⚠️ Important: Existing Users Must Migrate

If you have an existing installation, follow these steps to migrate to the secure version.

---

## 🚨 Breaking Changes

### 1. Password Hashing Changed
- **Old:** SHA256 (insecure)
- **New:** Bcrypt (secure)
- **Impact:** Existing passwords won't work

### 2. Authentication Required
- **Old:** AI endpoints were public
- **New:** AI endpoints require authentication
- **Impact:** Frontend must send JWT tokens

### 3. Database Schema
- **Impact:** Existing password hashes are incompatible

---

## 📋 Migration Steps

### Step 1: Backup Your Data
```bash
# Backup database
copy backend\app.db backend\app.db.backup

# Backup environment files
copy .env.docker .env.docker.backup
copy backend\.env backend\.env.backup
```

### Step 2: Update Code
```bash
# Pull latest changes
git pull origin main

# Or download latest release
```

### Step 3: Install Dependencies
```bash
cd backend
pip install --upgrade -r requirements.txt
```

### Step 4: Reset Database (Required)
```bash
cd backend

# Delete old database
del app.db

# Create new database with updated schema
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

### Step 5: Update Environment Variables
Ensure your `.env` files have the SECRET_KEY:

**`.env.docker`:**
```env
GEMINI_API_KEY=your_actual_gemini_api_key
SECRET_KEY=your_secure_32_char_secret_key
```

Generate a secure SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 6: Remove Sensitive Files from Git
```bash
remove-sensitive-files.bat

git add .gitignore
git commit -m "Security migration: Remove sensitive files"
git push
```

### Step 7: Restart Application
```bash
# For Docker
docker-compose down
docker-compose build --no-cache
docker-compose --env-file .env.docker up

# For local development
cd backend
uvicorn app.main:app --reload
```

### Step 8: Recreate User Accounts
**All users must sign up again** because password hashes are incompatible.

---

## 🔧 Frontend Updates Required

### Update API Calls to Include Authentication

**Before:**
```javascript
fetch('http://localhost:8000/api/v1/ai/question', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ question: 'What is Python?' })
})
```

**After:**
```javascript
const token = localStorage.getItem('token'); // Get from login

fetch('http://localhost:8000/api/v1/ai/question', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // Add this line
  },
  body: JSON.stringify({ question: 'What is Python?' })
})
```

### Handle 401 Unauthorized Errors
```javascript
fetch(url, options)
  .then(response => {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return response.json();
  })
```

### Handle 429 Rate Limit Errors
```javascript
fetch(url, options)
  .then(response => {
    if (response.status === 429) {
      // Rate limit exceeded
      alert('Too many requests. Please wait a moment.');
    }
    return response.json();
  })
```

---

## 🧪 Testing After Migration

### 1. Test User Signup
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#","role":"student"}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "userId": "user_abc123",
    "token": "eyJhbGc...",
    "role": "student"
  }
}
```

### 2. Test Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'
```

### 3. Test Protected Endpoint
```bash
# Get token from login response
TOKEN="your_token_here"

curl -X POST http://localhost:8000/api/v1/ai/question \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Python?"}'
```

### 4. Test Rate Limiting
```bash
# Make 25 rapid requests (should fail after 20)
for i in {1..25}; do
  curl -X POST http://localhost:8000/api/v1/ai/question \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"question":"test"}' &
done
wait
```

---

## 📊 Verification Checklist

Run the verification script:
```bash
python verify-security-complete.py
```

Manual checks:
- [ ] New users can sign up
- [ ] Users can log in and receive JWT token
- [ ] AI endpoints reject requests without token
- [ ] AI endpoints accept requests with valid token
- [ ] Rate limiting works (429 after 20 requests)
- [ ] No sensitive files in git (`git status`)
- [ ] Environment variables are set
- [ ] Application starts without errors

---

## 🐛 Common Issues

### Issue: "Invalid credentials" on login
**Cause:** Old password hash in database  
**Solution:** Delete database and recreate (Step 4)

### Issue: "Module 'passlib' not found"
**Cause:** Dependencies not installed  
**Solution:** `pip install passlib[bcrypt]`

### Issue: "401 Unauthorized" on all requests
**Cause:** Token not being sent or invalid  
**Solution:** Check Authorization header format: `Bearer <token>`

### Issue: Frontend can't connect to backend
**Cause:** CORS or backend not running  
**Solution:** 
1. Check backend is running: `http://localhost:8000/health`
2. Check CORS settings in `backend/app/main.py`

### Issue: "429 Too Many Requests" immediately
**Cause:** Rate limit too strict for development  
**Solution:** Increase limit in `backend/app/main.py`:
```python
app.add_middleware(AIRateLimitMiddleware, calls=100, period=60)
```

---

## 🔄 Rollback (If Needed)

If you need to rollback:

```bash
# Restore database
copy backend\app.db.backup backend\app.db

# Restore environment files
copy .env.docker.backup .env.docker
copy backend\.env.backup backend\.env

# Checkout previous version
git checkout <previous-commit-hash>

# Restart
docker-compose down
docker-compose up
```

---

## 📞 Need Help?

1. Check logs: `backend/logs/app.log`
2. Run verification: `python verify-security-complete.py`
3. Review documentation: `SECURITY_FIXES_APPLIED.md`
4. Check quick reference: `SECURITY_QUICK_REFERENCE.md`

---

## ✅ Migration Complete!

Once all checks pass, your application is successfully migrated to the secure version.

**Key improvements:**
- 🔐 Secure password hashing (bcrypt)
- 🛡️ Authentication on all AI endpoints
- 🚦 Rate limiting to prevent abuse
- 🔒 Sensitive files removed from git
- ⚠️ Proper error handling

**Your application is now production-ready!** 🎉
