from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database.models import (
    User, Patient, Doctor, Hospital, Appointment,
    BronzeFile, SilverFile, GoldReport, ETLLog, PipelineRun,
    DataQualityMetric, AuditLog, DataLineageRun,
    FactAdmissions, FactRevenue, DimPatient, DimHospital, DimDoctor, DimDisease, DimDate
)

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def create_user(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

class PatientRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, search: Optional[str] = None, gender: Optional[str] = None, disease: Optional[str] = None) -> List[Patient]:
        query = self.db.query(Patient)
        if search:
            query = query.filter(Patient.name.ilike(f"%{search}%"))
        if gender:
            query = query.filter(Patient.gender == gender)
        if disease:
            query = query.filter(Patient.disease == disease)
        return query.order_by(Patient.id.desc()).all()

class AuditRepository:
    def __init__(self, db: Session):
        self.db = db

    def log_action(self, user_email: str, action: str, details: str = "", status: str = "SUCCESS", ip: str = "127.0.0.1"):
        log = AuditLog(
            user_email=user_email,
            action=action,
            details=details,
            status=status,
            ip_address=ip
        )
        self.db.add(log)
        self.db.commit()

    def get_logs(self, limit: int = 50) -> List[AuditLog]:
        return self.db.query(AuditLog).order_by(AuditLog.id.desc()).limit(limit).all()

class LineageRepository:
    def __init__(self, db: Session):
        self.db = db

    def record_step(self, run_id: str, dataset_name: str, step: str, rec_in: int, rec_out: int, dur: float):
        entry = DataLineageRun(
            run_id=run_id,
            dataset_name=dataset_name,
            step=step,
            records_in=rec_in,
            records_out=rec_out,
            duration_sec=dur
        )
        self.db.add(entry)
        self.db.commit()

    def get_lineage(self, run_id: Optional[str] = None) -> List[DataLineageRun]:
        query = self.db.query(DataLineageRun)
        if run_id:
            query = query.filter(DataLineageRun.run_id == run_id)
        return query.order_by(DataLineageRun.id.asc()).all()

class WarehouseRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_fact_admissions_summary(self):
        return self.db.query(
            func.count(FactAdmissions.fact_id).label("total_admissions"),
            func.sum(FactAdmissions.bill_amount).label("total_revenue"),
            func.avg(FactAdmissions.stay_duration_days).label("avg_stay")
        ).first()
