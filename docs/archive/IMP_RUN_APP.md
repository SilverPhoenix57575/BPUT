# 🚀 How to Run the Application

## ✅ Complete Step-by-Step Guide

---

## 📋 Prerequisites (One-Time Setup)

### 1. Install Docker Desktop
1. Download: https://www.docker.com/products/docker-desktop/
2. Install and restart computer
3. Open Docker Desktop
4. Wait for whale icon in system tray (bottom right)

---

## 🎯 Running the Application

### Step 1: Open Terminal
1. Press `Windows + R`
2. Type `cmd` and press Enter
3. Navigate to project:
```bash
cd "D:\BPUT Hackathon\By-Me-and-Pratik"
```

### Step 2: Start Application
**Easy Way (Windows):**
```bash
start-docker.bat
```

**Or Command Line:**
```bash
docker-compose --env-file .env.docker up --build
```

### Step 3: Wait for Startup
You'll see these messages:
```
✓ Docker is running
Building and starting containers...
INFO: Application startup complete.
```
**⏱️ First time: 2-3 minutes**

### Step 4: Open Browser
**Go to:** http://localhost

**✅ Correct URLs:**
- Frontend: http://localhost
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

**❌ Don't use:** http://0.0.0.0:8000

### Step 5: Test Features
1. Click "Sign Up"
2. Create account (email + password)
3. Click "Upload" → Select PDF file
4. Click "Learn" → Ask AI a question
5. Click "Quiz" → Take a quiz
6. Click "Progress" → View your progress

---

## 🛑 Stopping the Application

### Method 1: Terminal
1. Press `Ctrl + C` in terminal
2. Wait for containers to stop
3. Run: `docker-compose down`

### Method 2: Script
```bash
stop-docker.bat
```

---

## 🔄 Making Changes & Updating

### When You Change Code:

**Step 1: Stop Application**
```bash
# Press Ctrl + C
docker-compose down
```

**Step 2: Rebuild & Restart**
```bash
docker-compose --env-file .env.docker up --build
```

**Step 3: Refresh Browser**
Go to http://localhost

---

## 🆘 Common Issues & Solutions

### Issue 1: "Port 8000 already in use"
```bash
# Find what's using the port
netstat -ano | findstr :8000

# Kill the process (replace <PID>)
taskkill /PID <PID> /F

# Restart
start-docker.bat
```

### Issue 2: "Cannot connect to Docker daemon"
**Solution:**
1. Open Docker Desktop
2. Wait for it to fully start
3. Look for whale icon in system tray
4. Try again

### Issue 3: "This site can't be reached"
**Solution:**
- ❌ Don't use: http://0.0.0.0:8000
- ✅ Use: http://localhost

### Issue 4: Changes not showing
```bash
# Clean rebuild
docker-compose down
docker system prune -f
docker-compose --env-file .env.docker up --build
```

### Issue 5: "CORS error" or signup fails
**Solution:** Already fixed! Just rebuild:
```bash
docker-compose down
docker-compose --env-file .env.docker up --build
```

---

## 📊 Checking Status

### View Logs:
```bash
docker-compose logs -f
```

### Check Running Containers:
```bash
docker-compose ps
```

### View Backend Logs Only:
```bash
docker-compose logs -f backend
```

### View Frontend Logs Only:
```bash
docker-compose logs -f frontend
```

---

## 🎯 Daily Workflow

### Starting Work:
```bash
cd "D:\BPUT Hackathon\By-Me-and-Pratik"
start-docker.bat
# Wait for startup
# Open http://localhost
```

### Making Changes:
```bash
# Edit code in VS Code or any editor
# Save files
# Stop: Ctrl + C
docker-compose down
docker-compose --env-file .env.docker up --build
# Refresh browser
```

### Ending Work:
```bash
# Press Ctrl + C
docker-compose down
# Close Docker Desktop (optional)
```

---

## ✅ Success Checklist

- [ ] Docker Desktop installed
- [ ] Docker Desktop running (whale icon visible)
- [ ] Terminal opened in project directory
- [ ] Ran `start-docker.bat`
- [ ] Saw "Application startup complete"
- [ ] http://localhost loads successfully
- [ ] Can create account
- [ ] Can upload files
- [ ] Can ask AI questions
- [ ] Can take quizzes

---

## 🎓 What's Running?

When you start the application:

**Backend Container:**
- Python 3.11 + FastAPI
- Gemini AI integration
- SQLite database
- Port: 8000

**Frontend Container:**
- React + Vite
- Nginx web server
- Port: 80 (http://localhost)

**Network:**
- Both containers connected
- Frontend can talk to backend
- You access via http://localhost

---

## 📞 Quick Commands Reference

| Task | Command |
|------|---------|
| **Start** | `start-docker.bat` |
| **Stop** | `Ctrl+C` then `docker-compose down` |
| **Restart** | `docker-compose --env-file .env.docker up` |
| **Rebuild** | `docker-compose --env-file .env.docker up --build` |
| **Logs** | `docker-compose logs -f` |
| **Status** | `docker-compose ps` |
| **Clean** | `docker system prune -f` |

---

## 🌐 Access Points

✅ **Use these URLs:**
- **Main App:** http://localhost
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

❌ **Don't use:**
- http://0.0.0.0:8000 (internal address)
- http://127.0.0.1 (use localhost)

---

## 🎉 You're All Set!

**To run the app:**
1. Open terminal
2. Run `start-docker.bat`
3. Go to http://localhost
4. Start learning! 🚀

**Need help?** Check the troubleshooting section above!
