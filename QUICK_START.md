# 🚀 Quick Start Guide

## ⚡ 3 Steps to Run

### Step 1: Install Docker Desktop
Download: https://www.docker.com/products/docker-desktop/

### Step 2: Start Application
**Windows:** Double-click `start-docker.bat`

**Or command line:**
```bash
docker-compose --env-file .env.docker up --build
```

### Step 3: Open Browser
- **Frontend:** http://localhost
- **Backend:** http://localhost:8000/docs

---

## 🎯 Test Features

1. Create account
2. Upload PDF file
3. Ask AI question
4. Take quiz
5. View progress

---

## 🛑 Stop Application

**Windows:** Double-click `stop-docker.bat`

**Or:**
```bash
docker-compose down
```

---

## ☸️ Kubernetes (Optional)

### Deploy:
```bash
deploy-kubernetes.bat
```

### Or manually:
```bash
kubectl apply -f deployment/kubernetes/
```

### Check status:
```bash
kubectl get all
```

---

## 📁 Important Paths

- **Docker Compose:** `docker-compose.yml`
- **Kubernetes:** `deployment/kubernetes/`
- **Backend:** `backend/`
- **Frontend:** `frontend/`

---

## 🆘 Troubleshooting

### Docker won't start?
1. Check Docker Desktop is running
2. Check ports 80 and 8000 are free

### Port already in use?
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

**That's it! You're ready to go! 🎉**
