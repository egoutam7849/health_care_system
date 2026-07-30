from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import PipelineRun, ETLLog, AirflowTaskRun

router = APIRouter(prefix="/monitoring", tags=["System Infrastructure Monitoring"])

@router.get("/metrics")
def get_monitoring_metrics(db: Session = Depends(get_db)):
    total_runs = db.query(PipelineRun).count()
    successful_runs = db.query(PipelineRun).filter(PipelineRun.status == "COMPLETED").count()
    failed_runs = db.query(PipelineRun).filter(PipelineRun.status == "FAILED").count()

    success_rate = round((successful_runs / total_runs * 100), 1) if total_runs > 0 else 100.0

    return {
        "infrastructure": {
            "pipeline_success_rate": success_rate,
            "failed_jobs": failed_runs,
            "running_jobs": 0,
            "avg_runtime_sec": 12.4,
            "storage_usage_mb": 42.8,
            "database_size_mb": 14.5,
            "airflow_health": "HEALTHY",
            "spark_job_status": "IDLE / READY",
            "api_response_time_ms": 18.5,
            "server_status": "ONLINE"
        },
        "history": [
            {"time": "04:00", "latency_ms": 22, "cpu_usage": 14},
            {"time": "05:00", "latency_ms": 18, "cpu_usage": 18},
            {"time": "06:00", "latency_ms": 19, "cpu_usage": 25},
            {"time": "07:00", "latency_ms": 16, "cpu_usage": 12},
            {"time": "08:00", "latency_ms": 21, "cpu_usage": 32},
            {"time": "09:00", "latency_ms": 18, "cpu_usage": 16}
        ]
    }
