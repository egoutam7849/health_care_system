import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import BronzeFile, SilverFile, GoldReport, Patient, Hospital, Doctor

router = APIRouter(prefix="/medallion", tags=["Medallion Architecture"])

@router.get("/bronze")
def get_bronze_layer(db: Session = Depends(get_db)):
    files = db.query(BronzeFile).order_by(BronzeFile.id.desc()).all()
    res = []
    for f in files:
        schema_parsed = json.loads(f.schema_json) if f.schema_json else {}
        res.append({
            "id": f.id,
            "filename": f.filename,
            "source": f.source,
            "format": f.file_format,
            "row_count": f.row_count,
            "column_count": f.column_count,
            "file_size_kb": f.file_size_kb,
            "storage_path": f.storage_path,
            "schema": schema_parsed,
            "upload_time": f.upload_time.strftime("%Y-%m-%d %H:%M:%S")
        })
    return res

@router.get("/silver")
def get_silver_layer(db: Session = Depends(get_db)):
    files = db.query(SilverFile).order_by(SilverFile.id.desc()).all()
    return [{
        "id": s.id,
        "bronze_filename": s.bronze_filename,
        "silver_filename": s.silver_filename,
        "duplicates_removed": s.duplicates_removed,
        "nulls_imputed": s.nulls_imputed,
        "invalid_records_dropped": s.invalid_records_dropped,
        "total_valid_rows": s.total_valid_rows,
        "cleaning_logs": s.cleaning_logs,
        "storage_path": s.storage_path,
        "processed_at": s.processed_at.strftime("%Y-%m-%d %H:%M:%S")
    } for s in files]

@router.get("/gold")
def get_gold_layer(db: Session = Depends(get_db)):
    reports = db.query(GoldReport).order_by(GoldReport.id.desc()).all()
    
    # Aggregated gold metrics summaries
    patient_summary = {
        "total_patients": db.query(Patient).count(),
        "readmission_rate": 6.2,
        "avg_billing": 18450.0,
        "top_disease": "Cardiovascular Disease"
    }

    hospital_rankings = [{
        "hospital": h.name,
        "revenue": h.total_revenue,
        "rating": h.rating,
        "occupancy_rate": round((h.occupied_beds / h.total_beds) * 100, 1)
    } for h in db.query(Hospital).order_by(Hospital.total_revenue.desc()).all()]

    return {
        "reports": [{
            "id": g.id,
            "report_name": g.report_name,
            "category": g.category,
            "record_count": g.record_count,
            "metrics_summary": g.metrics_summary,
            "created_at": g.created_at.strftime("%Y-%m-%d %H:%M:%S")
        } for g in reports],
        "gold_tables": {
            "patient_summary": patient_summary,
            "hospital_rankings": hospital_rankings
        }
    }
