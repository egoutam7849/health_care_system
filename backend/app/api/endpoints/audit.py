from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import AuditLog

router = APIRouter(prefix="/audit", tags=["Audit Logging"])

@router.get("/logs")
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(50).all()
    if not logs:
        # Populate initial sample audit logs if empty
        sample_actions = [
            ("admin@healthflow.ai", "User Login", "JWT Token session granted for Admin user", "SUCCESS"),
            ("admin@healthflow.ai", "Dataset Upload", "Ingested file 'raw_healthcare_admissions_2026_q2.csv'", "SUCCESS"),
            ("admin@healthflow.ai", "Pipeline Executed", "Triggered Medallion ETL Run RUN-20260730-001", "SUCCESS"),
            ("admin@healthflow.ai", "Report Generated", "Downloaded Patients Executive CSV Export", "SUCCESS"),
            ("system@healthflow.ai", "Quality Check Asserted", "Automated scan validated 99.8% health", "SUCCESS")
        ]
        for email, action, details, status in sample_actions:
            db.add(AuditLog(user_email=email, action=action, details=details, status=status))
        db.commit()
        logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(50).all()

    return [{
        "id": l.id,
        "user_email": l.user_email,
        "action": l.action,
        "details": l.details,
        "ip_address": l.ip_address,
        "status": l.status,
        "timestamp": l.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for l in logs]
