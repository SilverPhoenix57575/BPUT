# 🚨 SECURITY SETUP - START HERE

## ⚠️ API Key Exposed - Action Required

### Step 1: Revoke Old Key
1. Go to: https://makersuite.google.com/app/apikey
2. Delete key: `AIzaSyA7Kw-msA_-3HjhL3_O8SvpqSk87go57Vk`

### Step 2: Generate New Keys
```bash
# Run this to generate SECRET_KEY
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Or use the helper script
setup-security.bat
```

### Step 3: Update Environment Files

Update `.env.docker`:
```env
GEMINI_API_KEY=your_new_gemini_key
SECRET_KEY=your_generated_secret_key
```

Update `backend/.env`:
```env
GEMINI_API_KEY=your_new_gemini_key
DATABASE_URL=sqlite:///./app.db
SECRET_KEY=your_generated_secret_key
```

### Step 4: Reset Database
```bash
docker-compose down
del backend\app.db
docker-compose --env-file .env.docker up --build
```

### Step 5: Verify
```bash
python verify-security.py
```

---

## ✅ What's Now Secure

- ✅ JWT authentication (real tokens, 24h expiry)
- ✅ Bcrypt password hashing
- ✅ Protected API routes
- ✅ No exposed secrets

---

## 🔧 Troubleshooting

**Can't login?** Create new account (old passwords incompatible)

**App won't start?** Check both .env files have correct keys

**Need details?** Read `SECURITY_SETUP.md`
