# 🔐 Security Setup Guide

## Quick Setup

### 1. Get Gemini API Key
- Visit: https://makersuite.google.com/app/apikey
- Create new key
- **Never commit to Git**

### 2. Generate SECRET_KEY
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Update Environment Files

**`.env.docker`:**
```env
GEMINI_API_KEY=your_gemini_key
SECRET_KEY=your_secret_key
```

**`backend/.env`:**
```env
GEMINI_API_KEY=your_gemini_key
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your_secret_key
```

### 4. Reset Database
```bash
docker-compose down
del backend\app.db
docker-compose --env-file .env.docker up --build
```

---

## What's Implemented

### JWT Authentication
- Real JWT tokens (HS256)
- 24-hour expiration
- Bearer token auth
- Token verification

### Bcrypt Password Hashing
- Industry-standard bcrypt
- Automatic salt generation
- Secure verification

### Protected Routes
- Auth dependency
- Token validation
- 401 on invalid token

---

## Frontend Usage

Token is automatically added by axios interceptor:
```javascript
// Just make API calls normally
const response = await api.get('/api/protected')
```

---

## Troubleshooting

**Can't login?** Create new account (old passwords incompatible)

**Token expired?** Login again (24h expiry)

**401 errors?** Check token in localStorage
