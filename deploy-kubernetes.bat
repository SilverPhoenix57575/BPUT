@echo off
echo ========================================
echo   AI Learning Platform - Kubernetes
echo ========================================
echo.

echo [1/5] Checking Kubernetes...
kubectl version --client >nul 2>&1
if errorlevel 1 (
    echo ERROR: kubectl is not installed!
    echo Please enable Kubernetes in Docker Desktop.
    pause
    exit /b 1
)
echo ✓ Kubernetes is available

echo.
echo [2/5] Building Docker images...
cd backend
docker build -t ai-learning-backend:latest .
cd ..

cd frontend
docker build -t ai-learning-frontend:latest .
cd ..

echo.
echo [3/5] Applying ConfigMap and Secrets...
kubectl apply -f deployment/kubernetes/configmap.yaml
kubectl apply -f deployment/kubernetes/secret.yaml

echo.
echo [4/5] Deploying Backend...
kubectl apply -f deployment/kubernetes/backend-deployment.yaml
kubectl apply -f deployment/kubernetes/backend-service.yaml

echo.
echo [5/5] Deploying Frontend...
kubectl apply -f deployment/kubernetes/frontend-deployment.yaml
kubectl apply -f deployment/kubernetes/frontend-service.yaml

echo.
echo ========================================
echo   ✓ Deployment Complete!
echo ========================================
echo.
echo Checking status...
kubectl get all
echo.
echo Access the application at: http://localhost
echo.
pause
