# 📁 Project Structure

## Clean Organization

```
By-Me-and-Pratik/
│
├── backend/                    # Backend application
│   ├── app/                    # FastAPI app
│   │   ├── routers/           # API endpoints (6 routers)
│   │   ├── services/          # Business logic (5 services)
│   │   ├── utils/             # Helpers (4 utilities)
│   │   ├── main.py            # FastAPI entry
│   │   ├── models.py          # Database models
│   │   ├── database.py        # DB connection
│   │   └── config.py          # Configuration
│   ├── uploads/               # Uploaded files
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Backend container
│   └── README.md              # Backend docs
│
├── frontend/                   # Frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API client, storage
│   │   ├── stores/            # State management
│   │   ├── App.jsx            # Main app
│   │   └── main.jsx           # Entry point
│   ├── package.json           # Node dependencies
│   ├── Dockerfile             # Frontend container
│   ├── nginx.conf             # Nginx config
│   └── README.md              # Frontend docs
│
├── deployment/                 # Deployment configs
│   ├── docker/                # Docker setup
│   │   └── README.md          # Docker guide
│   └── kubernetes/            # Kubernetes setup
│       ├── configmap.yaml     # Configuration
│       ├── secret.yaml        # Secrets
│       ├── backend-*.yaml     # Backend K8s
│       ├── frontend-*.yaml    # Frontend K8s
│       └── README.md          # K8s guide
│
├── docs/                       # Documentation
│   ├── API.md                 # API reference
│   └── SETUP.md               # Complete setup guide
│
├── docker-compose.yml          # Docker Compose config
├── .env.docker                 # Docker environment
├── start-docker.bat            # Quick start script
├── stop-docker.bat             # Stop script
└── README.md                   # Main documentation
```

---

## File Purposes

### Root Files
- **README.md** - Main project documentation
- **docker-compose.yml** - Multi-container orchestration
- **.env.docker** - Environment variables for Docker
- **start-docker.bat** - One-click Docker start
- **stop-docker.bat** - One-click Docker stop

### Backend
- **app/** - All application code
- **requirements.txt** - Python dependencies
- **Dockerfile** - Container definition
- **README.md** - Backend setup guide

### Frontend
- **src/** - React application code
- **package.json** - Node dependencies
- **Dockerfile** - Container definition
- **nginx.conf** - Web server config
- **README.md** - Frontend setup guide

### Deployment
- **docker/** - Docker Compose documentation
- **kubernetes/** - K8s manifests and docs

### Docs
- **API.md** - API endpoint reference
- **SETUP.md** - Complete setup instructions

---

## Navigation Guide

### For Developers
1. Start here: **README.md**
2. Backend setup: **backend/README.md**
3. Frontend setup: **frontend/README.md**
4. API reference: **docs/API.md**

### For Docker Users
1. Start here: **README.md**
2. Docker guide: **deployment/docker/README.md**
3. Run: `start-docker.bat`

### For Kubernetes Users
1. Start here: **README.md**
2. K8s guide: **deployment/kubernetes/README.md**
3. Deploy: `kubectl apply -f deployment/kubernetes/`

---

## Removed Files

The following unnecessary files have been consolidated:
- Multiple redundant README files
- Duplicate setup guides
- Old status/summary files
- Temporary implementation notes
- Scattered documentation

All essential information is now in:
- Main README.md
- backend/README.md
- frontend/README.md
- deployment/*/README.md
- docs/*.md
