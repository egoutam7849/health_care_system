from sqlalchemy.orm import Session
from datetime import datetime
from app.database.models import AuditLog

def log_audit(db: Session, user_email: str, action: str, details: str = "", status: str = "SUCCESS", ip: str = "127.0.0.1"):
    try:
        log = AuditLog(
            user_email=user_email,
            action=action,
            details=details,
            status=status,
            ip_address=ip,
            timestamp=datetime.utcnow()
        )
        db.add(log)
        db.commit()
    except Exception as e:
        db.rollback()
