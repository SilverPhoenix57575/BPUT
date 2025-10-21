# 🔒 Security Quick Reference

## 🚀 Quick Start

```bash
# 1. Apply security fixes
apply-security-fixes.bat

# 2. Remove sensitive files from git
remove-sensitive-files.bat

# 3. Verify security
python verify-security-complete.py

# 4. Restart application
docker-compose down
docker-compose build --no-cache
docker-compose --env-file .env.docker up
```

---

## 🔐 What Was Fixed

| Fix | Status | Impact |
|-----|--------|--------|
| Bcrypt Password Hashing | ✅ | Passwords now securely hashed |
| Authentication Middleware | ✅ | All AI endpoints protected |
| Sensitive Files Removed | ✅ | No secrets in git |
| AI Rate Limiting | ✅ | 20 requests/min per IP |
| Error Handling | ✅ | No data leaks in errors |

---

## 🛡️ Security Features

### Password Security
- **Algorithm:** Bcrypt with automatic salt
- **Location:** `backend/app/auth.py`
- **Usage:** Automatic on signup/login

### Authentication
- **Type:** JWT Bearer tokens
- **Validation:** On every protected endpoint
- **Location:** `backend/app/dependencies.py`

### Rate Limiting
- **Global:** 100 requests/min
- **AI Endpoints:** 20 requests/min
- **Response:** 429 Too Many Requests

### Protected Endpoints
All `/api/v1/ai/*` endpoints require authentication:
- `/api/v1/ai/enhance`
- `/api/v1/ai/question`
- `/api/v1/ai/quiz`
- `/api/v1/ai/feedback`
- `/api/v1/ai/simplify`

---

## 📝 Code Examples

### Using Authentication in New Endpoints
```python
from fastapi import APIRouter, Depends
from ..dependencies import get_current_user, require_role
from ..models import User

router = APIRouter()

# Require any authenticated user
@router.post("/endpoint")
async def endpoint(current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    user_role = current_user.role
    # Your code here

# Require specific role
@router.post("/admin-only")
async def admin_endpoint(
    current_user: User = Depends(require_role(["admin", "educator"]))
):
    # Only admins and educators can access
    pass
```

### Testing Authentication
```bash
# 1. Login to get token
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Response: {"success":true,"data":{"token":"eyJ..."}}

# 2. Use token in requests
curl -X POST http://localhost:8000/api/v1/ai/question \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"question":"What is Python?"}'
```

---

## ⚠️ Important Notes

### Environment Variables
Never commit these files:
- `.env`
- `.env.docker`
- `backend/.env`
- `frontend/.env`

Always use `.env.example` as template.

### Database Files
Never commit:
- `*.db`
- `*.sqlite`
- `backend/app.db`

### Uploads Directory
Never commit:
- `backend/uploads/*`
- User uploaded files

### Logs
Never commit:
- `*.log`
- `backend/logs/*`

---

## 🧪 Testing Checklist

- [ ] Password hashing works (bcrypt)
- [ ] Login returns JWT token
- [ ] Protected endpoints reject requests without token
- [ ] Protected endpoints accept requests with valid token
- [ ] Rate limiting triggers after 20 AI requests
- [ ] Error responses don't leak sensitive data
- [ ] No sensitive files in git repository

---

## 🆘 Troubleshooting

### "Module 'passlib' not found"
```bash
cd backend
pip install passlib[bcrypt]
```

### "Invalid token" errors
- Check token format: `Bearer <token>`
- Verify SECRET_KEY matches in .env
- Token may be expired (7 days default)

### Rate limit too strict
Edit `backend/app/main.py`:
```python
app.add_middleware(AIRateLimitMiddleware, calls=50, period=60)  # 50 requests/min
```

### Need to reset database
```bash
cd backend
del app.db
python -c "from app.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

---

## 📞 Support

- Full documentation: `SECURITY_FIXES_APPLIED.md`
- Verification script: `python verify-security-complete.py`
- Issues: Check backend logs at `backend/logs/app.log`

---

**Last Updated:** 2024
**Version:** 1.0.0
