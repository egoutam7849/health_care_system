from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import DataQualityMetric
from app.services.quality_engine import DataQualityEngine

router = APIRouter(prefix="/quality", tags=["Data Quality Validation"])

@router.get("/metrics")
def get_quality_metrics(db: Session = Depends(get_db)):
    metrics = db.query(DataQualityMetric).all()
    if not metrics:
        engine = DataQualityEngine(db)
        engine.run_all_quality_checks()
        metrics = db.query(DataQualityMetric).all()

    return [{
        "id": m.id,
        "rule_name": m.rule_name,
        "category": m.category,
        "pass_count": m.pass_count,
        "fail_count": m.fail_count,
        "pass_percentage": m.pass_percentage,
        "status": m.status,
        "check_time": m.check_time.strftime("%Y-%m-%d %H:%M:%S")
    } for m in metrics]

@router.post("/run-checks")
def run_quality_checks(db: Session = Depends(get_db)):
    engine = DataQualityEngine(db)
    result = engine.run_all_quality_checks()
    return result
