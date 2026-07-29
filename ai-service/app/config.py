import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "999 Combo Store - AI Agent Service"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Internal Core Backend configuration
    CORE_BACKEND_URL: str = os.getenv("CORE_BACKEND_URL", "http://localhost:3000")
    INTERNAL_API_KEY: str = os.getenv("INTERNAL_API_KEY", "dev_secret_service_key_999")
    
    # Model configuration
    EMBEDDING_MODEL_NAME: str = "all-MiniLM-L6-v2"
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "mock_key")

    class Config:
        case_sensitive = True

settings = Settings()
