from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

# =====================================================================
# OLTP / CORE OPERATIONAL MODELS
# =====================================================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(String(50), default="Data Engineer")
    department = Column(String(100), default="Healthcare Analytics")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ColumnMappingTemplate(Base):
    __tablename__ = "column_mapping_templates"

    id = Column(Integer, primary_key=True, index=True)
    template_name = Column(String(100), nullable=False)
    dataset_type = Column(String(50), default="patients")
    mapping_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class BatchIngestionMetadata(Base):
    __tablename__ = "batch_ingestion_metadata"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(100), unique=True, index=True, nullable=False)
    dataset_name = Column(String(150), nullable=False)
    source_hospital = Column(String(150), default="Metro General Hospital")
    checksum_md5 = Column(String(64), nullable=True)
    schema_version = Column(String(20), default="v1.0")
    status = Column(String(50), default="COMPLETED")
    records_total = Column(Integer, default=0)
    records_valid = Column(Integer, default=0)
    records_quarantined = Column(Integer, default=0)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class QuarantineRecord(Base):
    __tablename__ = "quarantine_records"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(100), index=True, nullable=False)
    dataset_name = Column(String(150), nullable=False)
    raw_record_json = Column(Text, nullable=False)
    quarantine_reason = Column(String(200), nullable=False)
    quarantined_at = Column(DateTime, default=datetime.utcnow)

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    date_of_birth = Column(String(20), nullable=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(20), nullable=False)
    blood_group = Column(String(10), default="O+")
    phone = Column(String(50), nullable=True)
    email = Column(String(120), nullable=True)
    address = Column(String(250), nullable=True)
    city = Column(String(100), default="New York")
    state = Column(String(100), default="NY")
    emergency_contact = Column(String(100), nullable=True)
    insurance_provider = Column(String(100), default="BlueCross Health")
    insurance_number = Column(String(50), nullable=True)
    assigned_doctor_id = Column(String(50), nullable=True)
    assigned_hospital_id = Column(String(50), nullable=True)
    doctor_name = Column(String(100), nullable=False)
    hospital_name = Column(String(150), nullable=False)
    department = Column(String(100), default="General Medicine")
    disease = Column(String(100), nullable=False)
    diagnosis = Column(Text, nullable=True)
    admission_date = Column(String(20), nullable=False)
    discharge_date = Column(String(20), nullable=True)
    status = Column(String(50), default="Admitted")
    medical_history = Column(Text, nullable=True)
    bill_amount = Column(Float, default=0.0)
    is_readmitted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    doc_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(120), nullable=True)
    phone = Column(String(50), nullable=True)
    qualification = Column(String(100), default="MD, MBBS")
    specialization = Column(String(100), nullable=False)
    experience_years = Column(Integer, default=5)
    department = Column(String(100), default="Cardiology")
    hospital_name = Column(String(150), nullable=False)
    assigned_hospital_id = Column(String(50), nullable=True)
    consultation_fee = Column(Float, default=150.0)
    available_days = Column(String(100), default="Mon, Tue, Wed, Thu, Fri")
    available_time = Column(String(100), default="09:00 AM - 05:00 PM")
    status = Column(String(50), default="Active")
    profile_photo = Column(String(300), nullable=True)
    biography = Column(Text, nullable=True)
    patients_assigned = Column(Integer, default=0)
    success_rate = Column(Float, default=95.0)
    total_patients = Column(Integer, default=120)
    created_at = Column(DateTime, default=datetime.utcnow)

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    address = Column(String(250), nullable=True)
    city = Column(String(100), nullable=False)
    state = Column(String(100), default="NY")
    country = Column(String(100), default="USA")
    email = Column(String(120), nullable=True)
    phone = Column(String(50), nullable=True)
    available_beds = Column(Integer, default=50)
    total_beds = Column(Integer, nullable=False)
    occupied_beds = Column(Integer, nullable=False)
    icu_beds = Column(Integer, default=20)
    departments_json = Column(Text, nullable=True)
    total_revenue = Column(Float, default=0.0)
    rating = Column(Float, default=4.5)
    doctors_count = Column(Integer, default=15)
    patients_count = Column(Integer, default=250)
    created_at = Column(DateTime, default=datetime.utcnow)

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    appointment_id = Column(String(50), unique=True, index=True, nullable=False)
    patient_id = Column(String(50), nullable=True)
    doctor_id = Column(String(50), nullable=True)
    hospital_id = Column(String(50), nullable=True)
    patient_name = Column(String(100), nullable=False)
    doctor_name = Column(String(100), nullable=False)
    hospital_name = Column(String(150), nullable=False)
    department = Column(String(100), default="General Medicine")
    appointment_date = Column(String(50), nullable=False)
    time_slot = Column(String(20), nullable=False)
    reason = Column(Text, nullable=True)
    status = Column(String(50), default="Upcoming")
    created_at = Column(DateTime, default=datetime.utcnow)

class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    prescription_id = Column(String(50), unique=True, index=True, nullable=False)
    patient_id = Column(String(50), nullable=True)
    doctor_id = Column(String(50), nullable=True)
    patient_name = Column(String(100), nullable=False)
    doctor_name = Column(String(100), nullable=False)
    medication = Column(String(150), nullable=False)
    dosage = Column(String(100), nullable=False)
    instructions = Column(Text, nullable=True)
    refills_remaining = Column(Integer, default=2)
    created_at = Column(DateTime, default=datetime.utcnow)

class LabReport(Base):
    __tablename__ = "lab_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(String(50), unique=True, index=True, nullable=False)
    patient_id = Column(String(50), nullable=True)
    doctor_id = Column(String(50), nullable=True)
    patient_name = Column(String(100), nullable=False)
    doctor_name = Column(String(100), nullable=False)
    test_name = Column(String(150), nullable=False)
    category = Column(String(100), default="General Laboratory")
    result = Column(String(200), nullable=False)
    status = Column(String(50), default="FINAL")
    created_at = Column(DateTime, default=datetime.utcnow)

# =====================================================================
# MEDALLION PIPELINE METADATA & PIPELINE LOGS
# =====================================================================

class BronzeFile(Base):
    __tablename__ = "bronze_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(200), nullable=False)
    source = Column(String(100), default="Manual Upload")
    file_format = Column(String(20), default="CSV")
    row_count = Column(Integer, default=0)
    column_count = Column(Integer, default=0)
    file_size_kb = Column(Float, default=0.0)
    storage_path = Column(String(300), nullable=False)
    schema_json = Column(Text, nullable=True)
    upload_time = Column(DateTime, default=datetime.utcnow)

class SilverFile(Base):
    __tablename__ = "silver_files"

    id = Column(Integer, primary_key=True, index=True)
    bronze_filename = Column(String(200), nullable=False)
    silver_filename = Column(String(200), nullable=False)
    duplicates_removed = Column(Integer, default=0)
    nulls_imputed = Column(Integer, default=0)
    invalid_records_dropped = Column(Integer, default=0)
    total_valid_rows = Column(Integer, default=0)
    cleaning_logs = Column(Text, nullable=True)
    storage_path = Column(String(300), nullable=False)
    processed_at = Column(DateTime, default=datetime.utcnow)

class GoldReport(Base):
    __tablename__ = "gold_reports"

    id = Column(Integer, primary_key=True, index=True)
    report_name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False)
    record_count = Column(Integer, default=0)
    metrics_summary = Column(Text, nullable=True)
    storage_path = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ETLLog(Base):
    __tablename__ = "etl_logs"

    id = Column(Integer, primary_key=True, index=True)
    pipeline_run_id = Column(String(100), index=True, nullable=False)
    step = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    duration_sec = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)

class PipelineRun(Base):
    __tablename__ = "pipeline_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(100), unique=True, index=True, nullable=False)
    dataset_name = Column(String(150), nullable=False)
    status = Column(String(50), default="RUNNING")
    records_processed = Column(Integer, default=0)
    execution_time_sec = Column(Float, default=0.0)
    bronze_status = Column(String(20), default="COMPLETED")
    silver_status = Column(String(20), default="COMPLETED")
    gold_status = Column(String(20), default="COMPLETED")
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class AirflowTaskRun(Base):
    __tablename__ = "airflow_task_runs"

    id = Column(Integer, primary_key=True, index=True)
    dag_id = Column(String(100), nullable=False)
    task_id = Column(String(100), nullable=False)
    execution_date = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    duration_sec = Column(Float, default=1.5)
    try_number = Column(Integer, default=1)
    timestamp = Column(DateTime, default=datetime.utcnow)

class DataQualityMetric(Base):
    __tablename__ = "data_quality_metrics"

    id = Column(Integer, primary_key=True, index=True)
    rule_name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False)
    pass_count = Column(Integer, default=0)
    fail_count = Column(Integer, default=0)
    pass_percentage = Column(Float, default=100.0)
    status = Column(String(20), default="PASSED")
    check_time = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="info")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(120), nullable=False)
    action = Column(String(150), nullable=False)
    ip_address = Column(String(50), default="127.0.0.1")
    status = Column(String(50), default="SUCCESS")
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class DataLineageRun(Base):
    __tablename__ = "data_lineage_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_id = Column(String(100), nullable=False, index=True)
    dataset_name = Column(String(150), nullable=False)
    step = Column(String(100), nullable=False)
    records_in = Column(Integer, default=0)
    records_out = Column(Integer, default=0)
    duration_sec = Column(Float, default=0.0)
    status = Column(String(50), default="COMPLETED")
    pipeline_version = Column(String(20), default="v1.0-pyspark")
    user = Column(String(100), default="admin@healthflow.ai")
    timestamp = Column(DateTime, default=datetime.utcnow)

# =====================================================================
# DATA WAREHOUSE STAR SCHEMA (FACT & DIMENSION TABLES)
# =====================================================================

class DimPatient(Base):
    __tablename__ = "dim_patient"

    patient_key = Column(Integer, primary_key=True, index=True)
    patient_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    age_group = Column(String(50), nullable=False)
    gender = Column(String(20), nullable=False)
    city = Column(String(100), nullable=False)

class DimHospital(Base):
    __tablename__ = "dim_hospital"

    hospital_key = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    city = Column(String(100), nullable=False)
    total_beds = Column(Integer, nullable=False)
    rating = Column(Float, default=4.5)

class DimDoctor(Base):
    __tablename__ = "dim_doctor"

    doctor_key = Column(Integer, primary_key=True, index=True)
    doc_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    specialization = Column(String(100), nullable=False)
    experience_years = Column(Integer, default=5)

class DimDisease(Base):
    __tablename__ = "dim_disease"

    disease_key = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String(100), unique=True, nullable=False)
    category = Column(String(100), default="General Medicine")
    severity_index = Column(Integer, default=50)

class DimDate(Base):
    __tablename__ = "dim_date"

    date_key = Column(Integer, primary_key=True, index=True)
    date_iso = Column(String(20), unique=True, nullable=False)
    year = Column(Integer, nullable=False)
    quarter = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    month_name = Column(String(20), nullable=False)
    day = Column(Integer, nullable=False)
    is_weekend = Column(Boolean, default=False)

class FactAdmissions(Base):
    __tablename__ = "fact_admissions"

    fact_id = Column(Integer, primary_key=True, index=True)
    patient_key = Column(Integer, ForeignKey("dim_patient.patient_key"))
    hospital_key = Column(Integer, ForeignKey("dim_hospital.hospital_key"))
    doctor_key = Column(Integer, ForeignKey("dim_doctor.doctor_key"))
    disease_key = Column(Integer, ForeignKey("dim_disease.disease_key"))
    date_key = Column(Integer, ForeignKey("dim_date.date_key"))
    bill_amount = Column(Float, nullable=False)
    stay_duration_days = Column(Integer, default=5)
    is_readmitted = Column(Boolean, default=False)

    patient = relationship("DimPatient")
    hospital = relationship("DimHospital")
    doctor = relationship("DimDoctor")
    disease = relationship("DimDisease")
    date = relationship("DimDate")

class FactRevenue(Base):
    __tablename__ = "fact_revenue"

    fact_revenue_id = Column(Integer, primary_key=True, index=True)
    hospital_key = Column(Integer, ForeignKey("dim_hospital.hospital_key"))
    date_key = Column(Integer, ForeignKey("dim_date.date_key"))
    total_revenue = Column(Float, nullable=False)
    total_admissions = Column(Integer, default=0)
    avg_bill_amount = Column(Float, default=0.0)

    hospital = relationship("DimHospital")
    date = relationship("DimDate")
