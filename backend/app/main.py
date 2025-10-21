from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from .database import engine, Base
from .routers import content, ai, auth, educator, career, progress, analytics, projects, pomodoro, mindmap
from .constants import UPLOAD_DIR
from .logger import setup_logger
from .config import settings
from .middleware import AIRateLimitMiddleware, LoggingMiddleware
import os

logger = setup_logger(__name__)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Learning Platform API",
    version="1.0.0",
    description="Backend API for AI-powered learning platform",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc",
    openapi_url="/api/v1/openapi.json"
)

logger.info("Starting AI Learning Platform API")

# Global exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "error": "Invalid request data", "details": exc.errors()}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"success": False, "error": "An unexpected error occurred"}
    )

# CORS configuration
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost",
    "http://localhost:80",
]

# Add production origins from environment
if hasattr(settings, 'ALLOWED_ORIGINS'):
    allowed_origins.extend(settings.ALLOWED_ORIGINS.split(','))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Add compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add rate limiting middleware
app.add_middleware(AIRateLimitMiddleware, calls=20, period=60)
app.add_middleware(LoggingMiddleware)

# API v1 routes
app.include_router(content.router, prefix="/api/v1/content", tags=["content"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(educator.router, prefix="/api/v1/educator", tags=["educator"])
app.include_router(career.router, prefix="/api/v1/career", tags=["career"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["progress"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["projects"])
app.include_router(pomodoro.router, prefix="/api/v1/pomodoro", tags=["pomodoro"])
app.include_router(mindmap.router, prefix="/api/v1/mindmap", tags=["mindmap"])

# Legacy routes (backward compatibility)
app.include_router(content.router, prefix="/api/content", tags=["content-legacy"], include_in_schema=False)
app.include_router(ai.router, prefix="/api/ai", tags=["ai-legacy"], include_in_schema=False)
app.include_router(auth.router, prefix="/api/auth", tags=["auth-legacy"], include_in_schema=False)
app.include_router(educator.router, prefix="/api/educator", tags=["educator-legacy"], include_in_schema=False)
app.include_router(career.router, prefix="/api/career", tags=["career-legacy"], include_in_schema=False)
app.include_router(progress.router, prefix="/api/progress", tags=["progress-legacy"], include_in_schema=False)
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics-legacy"], include_in_schema=False)
app.include_router(projects.router, prefix="/api/projects", tags=["projects-legacy"], include_in_schema=False)
app.include_router(pomodoro.router, prefix="/api/pomodoro", tags=["pomodoro-legacy"], include_in_schema=False)
app.include_router(mindmap.router, prefix="/api/mindmap", tags=["mindmap-legacy"], include_in_schema=False)

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
def root():
    logger.info("Root endpoint accessed")
    return {
        "success": True,
        "data": {
            "message": "AI Learning Platform API",
            "version": "1.0.0",
            "status": "running",
            "docs": "/api/v1/docs"
        }
    }

@app.get("/health")
def health():
    return {
        "success": True,
        "data": {
            "status": "healthy",
            "database": "connected",
            "storage": "ready"
        }
    }
