from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import content, ai, auth, educator, career, progress

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Learning Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

@app.get("/")
def root():
    return {"message": "AI Learning Platform API", "version": "1.0.0", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}
