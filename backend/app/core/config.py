# =============================================================================
# CONFIGURACIÓN Y VARIABLES DE ENTORNO (PYDANTIC SETTINGS)
# =============================================================================

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl

class Settings(BaseSettings):
    PROJECT_NAME: str = "ConfyTickets"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    
    # Orígenes CORS permitidos
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "capacitor://localhost",
        "http://localhost"
    ]

    # Base de Datos PostgreSQL
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "confy_admin"
    POSTGRES_PASSWORD: str = "confy_secure_password_2026"
    POSTGRES_DB: str = "confytickets_db"
    DATABASE_URL: str = "postgresql+asyncpg://confy_admin:confy_secure_password_2026@localhost:5432/confytickets_db"

    # Redis y Celery
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    # Supabase Auth
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # Reglas por defecto
    DEFAULT_STAMPS_REQUIRED: int = 8
    QR_EXPIRATION_SECONDS: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
