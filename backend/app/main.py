from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routers import content, ai, auth, educator, career, progress, analytics, projects
import os
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Learning Platform API",
    version="1.0.0",
    description="Backend API for AI-powered learning platform"
)

logger.info("Starting AI Learning Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(content.router, prefix="/api/content", tags=["content"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(educator.router, prefix="/api/educator", tags=["educator"])
app.include_router(career.router, prefix="/api/career", tags=["career"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])

uploads_dir = "uploads"
if not os.path.exists(uploads_dir):
    os.makedirs(uploads_dir)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

@app.get("/")
def root():
    logger.info("Root endpoint accessed")
    return {"message": "AI Learning Platform API", "version": "1.0.0", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy", "database": "connected", "storage": "ready"}
