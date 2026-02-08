from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # 데이터베이스
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/polarissync"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://polarissync.com",
        "https://polarissync-943327451630.asia-northeast3.run.app"
    ]
    
    # 환경
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()
