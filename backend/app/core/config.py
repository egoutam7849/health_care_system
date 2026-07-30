import os

class Settings:
    PROJECT_NAME: str = "HealthFlow AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "healthflow_ai_super_secret_jwt_key_2026_healthcare_data_engineering"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    ALGORITHM: str = "HS256"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./healthflow.db")

    # Storage Paths
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    BRONZE_DIR: str = os.path.join(BASE_DIR, "uploads", "bronze")
    SILVER_DIR: str = os.path.join(BASE_DIR, "uploads", "silver")
    GOLD_DIR: str = os.path.join(BASE_DIR, "uploads", "gold")

settings = Settings()

os.makedirs(settings.BRONZE_DIR, exist_ok=True)
os.makedirs(settings.SILVER_DIR, exist_ok=True)
os.makedirs(settings.GOLD_DIR, exist_ok=True)
