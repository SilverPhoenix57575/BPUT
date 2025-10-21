#!/bin/bash
# Kubernetes rollback script

DEPLOYMENT=$1

if [ -z "$DEPLOYMENT" ]; then
  echo "Usage: ./rollback.sh <deployment-name>"
  echo "Available deployments: backend, frontend"
  exit 1
fi

echo "Rolling back deployment: $DEPLOYMENT"

# Rollback to previous version
kubectl rollout undo deployment/$DEPLOYMENT

# Wait for rollback to complete
kubectl rollout status deployment/$DEPLOYMENT

# Show rollout history
echo ""
echo "Rollout history:"
kubectl rollout history deployment/$DEPLOYMENT

echo ""
echo "Rollback completed successfully"
