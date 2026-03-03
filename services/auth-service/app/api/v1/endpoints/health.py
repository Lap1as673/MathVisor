from fastapi import APIRouter
from datetime import datetime
from app.schemas.health import HealthResponse
from app.core.config import settings

router = APIRouter()

@router.get(
    "/health",
    response_model=HealthResponse,
    tags=["health"],
    summary="Проверка работоспособности сервиса"
)
async def health_check():
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        timestamp=datetime.now()
    )

@router.get("/ready", tags=["health"])
async def readiness_check():
    return {"status": "ready", "message": "Service is ready to accept traffic"}

@router.get("/live", tags=["health"])
async def liveness_check():
    return {"status": "alive", "message": "Service is running"}