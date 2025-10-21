# 🐳 Docker Setup - Complete Guide

## 📋 Prerequisites

1. **Install Docker Desktop**
   - Download: https://www.docker.com/products/docker-desktop/
   - Install and restart computer
   - Start Docker Desktop
   - Wait for whale icon in system tray

---

## 🚀 Step-by-Step Setup

### Step 1: Open Terminal
```bash
# Press Windows + R, type cmd, press Enter
# Then navigate to project:
cd "D:\BPUT Hackathon\By-Me-and-Pratik"
```

### Step 2: Start Application
**Option A - One Click (Windows):**
```bash
start-docker.bat
```

**Option B - Command Line:**
```bash
docker-compose --env-file .env.docker up --build
```

### Step 3: Wait for Startup
You'll see:
```
✓ Docker is running
Building and starting containers...
INFO: Application startup complete.
```
**Wait 2-3 minutes on first run**

### Step 4: Access Application
**⚠️ IMPORTANT: Use these URLs only**

- **Frontend (Main App):** http://localhost
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

**❌ DON'T use:** http://0.0.0.0:8000 (won't work)

### Step 5: Test Features
1. Go to http://localhost
2. Click "Sign Up"
3. Create account (email + password)
4. Upload a PDF file
5. Ask AI a question
6. Take a quiz

---

---

## 🔄 Update & Restart

### When You Make Code Changes:

**Step 1: Stop Application**
```bash
# Press Ctrl + C in terminal
# Then run:
docker-compose down
```

**Step 2: Rebuild & Restart**
```bash
docker-compose --env-file .env.docker up --build
```

**Step 3: Wait for Startup**
Look for "Application startup complete"

**Step 4: Refresh Browser**
Go to http://localhost

---

## 📝 Common Commands

```bash
# Start (after first time)
docker-compose --env-file .env.docker up

# Start in background
docker-compose --env-file .env.docker up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# View backend logs only
docker-compose logs -f backend

# Rebuild after changes
docker-compose --env-file .env.docker up --build

# Check running containers
docker-compose ps
```

---

---

## 🆘 Troubleshooting

### Issue: "Port 8000 already in use"
**Solution:**
```bash
# Find process using port
netstat -ano | findstr :8000

# Kill process (replace <PID> with actual number)
taskkill /PID <PID> /F

# Restart Docker
docker-compose --env-file .env.docker up --build
```

### Issue: "Cannot connect to Docker daemon"
**Solution:**
1. Open Docker Desktop
2. Wait for whale icon to appear
3. Try again

### Issue: "This site can't be reached"
**Solution:**
- ❌ Don't use: http://0.0.0.0:8000
- ✅ Use: http://localhost or http://localhost:8000

### Issue: "CORS error" or "400 Bad Request"
**Solution:**
CORS is already fixed in backend. Just rebuild:
```bash
docker-compose down
docker-compose --env-file .env.docker up --build
```

### Issue: Changes not reflecting
**Solution:**
```bash
# Clean rebuild
docker-compose down
docker system prune -f
docker-compose --env-file .env.docker up --build
```

### Issue: Containers won't start
**Solution:**
```bash
# Check logs
docker-compose logs

# Remove everything and start fresh
docker-compose down -v
docker system prune -a -f
docker-compose --env-file .env.docker up --build
```

---

---

## 📁 Important Files

- `docker-compose.yml` - Orchestrates backend + frontend
- `.env.docker` - API keys and secrets
- `backend/Dockerfile` - Backend container config
- `frontend/Dockerfile` - Frontend container config
- `backend/app/main.py` - Backend CORS settings (fixed)
- `start-docker.bat` - One-click start script
- `stop-docker.bat` - One-click stop script

---

## ✅ Success Checklist

- [ ] Docker Desktop installed and running
- [ ] Navigated to project directory
- [ ] Ran `start-docker.bat` or `docker-compose up`
- [ ] Saw "Application startup complete"
- [ ] Frontend loads at http://localhost
- [ ] Backend API at http://localhost:8000/docs
- [ ] Can create account
- [ ] Can upload files
- [ ] Can ask AI questions

---

## 🎯 Quick Reference

| Action | Command |
|--------|----------|
| **First Start** | `start-docker.bat` |
| **Stop** | `Ctrl+C` then `docker-compose down` |
| **Restart** | `docker-compose --env-file .env.docker up` |
| **Rebuild** | `docker-compose --env-file .env.docker up --build` |
| **View Logs** | `docker-compose logs -f` |
| **Check Status** | `docker-compose ps` |

---

## 🌐 Access URLs

✅ **Use these:**
- Frontend: http://localhost
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

❌ **Don't use:**
- http://0.0.0.0:8000 (internal Docker address)
- http://127.0.0.1 (use localhost instead)

---

**Your app is ready! Go to http://localhost 🚀**
