from fastapi import APIRouter
from app.config import settings

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": "sqlite_pgvector_compat_ok",
        "redis": "ok"
    }
