from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/settings", tags=["Settings"])

class SystemSettings(BaseModel):
    theme: str = "light"
    notifications_enabled: bool = True
    email_alerts: bool = True
    airflow_url: str = "http://localhost:8080"
    spark_master: str = "spark://localhost:7077"
    parquet_compression: str = "snappy"

# In-memory settings state
current_settings = SystemSettings()

@router.get("/")
def get_settings():
    return current_settings

@router.post("/")
def update_settings(new_settings: SystemSettings):
    global current_settings
    current_settings = new_settings
    return {"message": "Settings updated successfully", "settings": current_settings}
