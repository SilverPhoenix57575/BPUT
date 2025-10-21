from pydantic_settings import BaseSettings
import secrets

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    DATABASE_URL: str = "sqlite:///./app.db"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    
    class Config:
        env_file = ".env"

settings = Settings()
