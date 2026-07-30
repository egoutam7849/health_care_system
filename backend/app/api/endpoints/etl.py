import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import PipelineRun, ETLLog, BronzeFile
from app.services.etl_engine import MedallionETLEngine
from app.core.config import settings

router = APIRouter(prefix="/etl", tags=["ETL Pipeline"])

@router.post("/run")
def trigger_etl_run(filename: str = "raw_healthcare_admissions_2026_q2.csv", db: Session = Depends(get_db)):
    file_path = os.path.join(settings.BRONZE_DIR, filename)
    if not os.path.exists(file_path):
        # Create default sample file if it doesn't exist
        with open(file_path, "w") as f:
            f.write("patient_id,name,age,gender,disease,hospital_name,doctor_name,admission_date,discharge_date,bill_amount,city\n")
            f.write("PAT-501,Eleanor Rigby,62,Female,Cardiovascular Disease,Metro General Hospital,Dr. Alexander Wright,2026-07-01,2026-07-08,18500.0,New York\n")
            f.write("PAT-502,George Harrison,58,Male,Diabetes Mellitus Type II,Johns Hopkins Medical Center,Dr. Elena Rostova,2026-07-03,2026-07-10,12400.0,Baltimore\n")

    etl = MedallionETLEngine(db)
    result = etl.process_dataset(file_path, filename)
    return result

@router.get("/runs")
def get_pipeline_runs(db: Session = Depends(get_db)):
    runs = db.query(PipelineRun).order_by(PipelineRun.id.desc()).all()
    return [{
        "id": r.id,
        "run_id": r.run_id,
        "dataset_name": r.dataset_name,
        "status": r.status,
        "records_processed": r.records_processed,
        "execution_time_sec": r.execution_time_sec,
        "started_at": r.started_at.strftime("%Y-%m-%d %H:%M:%S")
    } for r in runs]

@router.get("/logs/{run_id}")
def get_pipeline_logs(run_id: str, db: Session = Depends(get_db)):
    logs = db.query(ETLLog).filter(ETLLog.pipeline_run_id == run_id).order_by(ETLLog.id.asc()).all()
    return [{
        "step": l.step,
        "status": l.status,
        "message": l.message,
        "duration_sec": l.duration_sec,
        "timestamp": l.timestamp.strftime("%H:%M:%S")
    } for l in logs]
