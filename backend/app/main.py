from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import missions, users, sensors

app = FastAPI(
    title="PolarisSync API",
    description="망원경 극축 정렬 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(missions.router, prefix="/api/missions", tags=["missions"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(sensors.router, prefix="/api/sensors", tags=["sensors"])

@app.get("/")
def root():
    return {"message": "PolarisSync API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
