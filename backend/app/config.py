from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    DATABASE_URL: str = "sqlite:///./app.db"
    SECRET_KEY: str
<<<<<<< HEAD
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
=======
    ALLOWED_ORIGINS: str = ""
>>>>>>> 023b0b074d404c60f4636151687192365b04a3a0
    
    class Config:
        env_file = ".env"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.SECRET_KEY:
            raise ValueError("SECRET_KEY must be set in environment variables")

settings = Settings()
