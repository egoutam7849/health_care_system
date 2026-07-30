from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_email: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "Data Engineer"
    department: Optional[str] = "Healthcare Analytics"

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    department: str

    class Config:
        from_attributes = True

# Dashboard Stats Schemas
class DashboardStatsOut(BaseModel):
    total_patients: int
    total_doctors: int
    total_hospitals: int
    total_admissions: int
    total_revenue: float
    avg_stay_days: float
    recovered_patients: int
    readmission_rate: float
    pipeline_status: str
    latest_etl_run: str
    quality_score: float

# Entity Schemas
class PatientOut(BaseModel):
    id: int
    patient_id: str
    name: str
    age: int
    gender: str
    disease: str
    hospital_name: str
    doctor_name: str
    admission_date: str
    discharge_date: Optional[str]
    bill_amount: float
    city: str
    status: str
    is_readmitted: bool

    class Config:
        from_attributes = True

class DoctorOut(BaseModel):
    id: int
    doc_id: str
    name: str
    specialization: str
    hospital_name: str
    experience_years: int
    success_rate: float
    total_patients: int
    email: Optional[str]
    phone: Optional[str]

    class Config:
        from_attributes = True

class HospitalOut(BaseModel):
    id: int
    hospital_id: str
    name: str
    city: str
    total_beds: int
    occupied_beds: int
    total_revenue: float
    rating: float
    doctors_count: int
    patients_count: int

    class Config:
        from_attributes = True

class AppointmentOut(BaseModel):
    id: int
    appointment_id: str
    patient_name: str
    doctor_name: str
    hospital_name: str
    appointment_date: str
    time_slot: str
    status: str
    department: str

    class Config:
        from_attributes = True
