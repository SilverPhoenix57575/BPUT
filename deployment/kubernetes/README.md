# ☸️ Kubernetes Setup

## Prerequisites

1. Enable Kubernetes in Docker Desktop
2. Build Docker images

---

## Quick Deploy

### Step 1: Build Images
```bash
docker build -t ai-learning-backend:latest ./backend
docker build -t ai-learning-frontend:latest ./frontend
```

### Step 2: Deploy
```bash
kubectl apply -f deployment/kubernetes/
```

### Step 3: Verify
```bash
kubectl get all
kubectl get pods
kubectl get services
```

### Step 4: Access
```bash
kubectl get service frontend
# Access at http://localhost
```

---

## Commands

```bash
# View logs
kubectl logs -l app=ai-learning-backend -f

# Scale
kubectl scale deployment backend --replicas=3

# Update
kubectl rollout restart deployment backend

# Delete
kubectl delete -f deployment/kubernetes/
```

---

## Files

- `configmap.yaml` - Configuration
- `secret.yaml` - API keys
- `backend-deployment.yaml` - Backend pods
- `backend-service.yaml` - Backend service
- `frontend-deployment.yaml` - Frontend pods
- `frontend-service.yaml` - Frontend service

---

## Troubleshooting

### Check pod status
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Port forward for testing
```bash
kubectl port-forward service/frontend 8080:80
```
