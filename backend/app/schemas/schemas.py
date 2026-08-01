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

# Patient Schemas
class PatientCreate(BaseModel):
    patient_id: Optional[str] = None
    name: str
    date_of_birth: Optional[str] = None
    age: int
    gender: str
    blood_group: Optional[str] = "O+"
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = "New York"
    state: Optional[str] = "NY"
    emergency_contact: Optional[str] = None
    insurance_provider: Optional[str] = "BlueCross Health"
    insurance_number: Optional[str] = None
    assigned_doctor_id: Optional[str] = None
    assigned_hospital_id: Optional[str] = None
    doctor_name: str
    hospital_name: str
    department: Optional[str] = "General Medicine"
    disease: str
    diagnosis: Optional[str] = None
    admission_date: str
    discharge_date: Optional[str] = None
    status: Optional[str] = "Admitted"
    medical_history: Optional[str] = None
    bill_amount: Optional[float] = 0.0
    is_readmitted: Optional[bool] = False

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    date_of_birth: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    emergency_contact: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_number: Optional[str] = None
    assigned_doctor_id: Optional[str] = None
    assigned_hospital_id: Optional[str] = None
    doctor_name: Optional[str] = None
    hospital_name: Optional[str] = None
    department: Optional[str] = None
    disease: Optional[str] = None
    diagnosis: Optional[str] = None
    admission_date: Optional[str] = None
    discharge_date: Optional[str] = None
    status: Optional[str] = None
    medical_history: Optional[str] = None
    bill_amount: Optional[float] = None
    is_readmitted: Optional[bool] = None

class PatientOut(BaseModel):
    id: int
    patient_id: str
    name: str
    date_of_birth: Optional[str] = None
    age: int
    gender: str
    blood_group: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    emergency_contact: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_number: Optional[str] = None
    assigned_doctor_id: Optional[str] = None
    assigned_hospital_id: Optional[str] = None
    doctor_name: str
    hospital_name: str
    department: Optional[str] = None
    disease: str
    diagnosis: Optional[str] = None
    admission_date: str
    discharge_date: Optional[str] = None
    status: str
    medical_history: Optional[str] = None
    bill_amount: float
    is_readmitted: bool

    class Config:
        from_attributes = True

# Doctor Schemas
class DoctorCreate(BaseModel):
    doc_id: Optional[str] = None
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    qualification: Optional[str] = "MD, MBBS"
    specialization: str
    experience_years: Optional[int] = 5
    department: Optional[str] = "Cardiology"
    hospital_name: str
    assigned_hospital_id: Optional[str] = None
    consultation_fee: Optional[float] = 150.0
    available_days: Optional[str] = "Mon, Tue, Wed, Thu, Fri"
    available_time: Optional[str] = "09:00 AM - 05:00 PM"
    status: Optional[str] = "Active"
    profile_photo: Optional[str] = None
    biography: Optional[str] = None
    patients_assigned: Optional[int] = 0
    success_rate: Optional[float] = 95.0
    total_patients: Optional[int] = 120

class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    qualification: Optional[str] = None
    specialization: Optional[str] = None
    experience_years: Optional[int] = None
    department: Optional[str] = None
    hospital_name: Optional[str] = None
    assigned_hospital_id: Optional[str] = None
    consultation_fee: Optional[float] = None
    available_days: Optional[str] = None
    available_time: Optional[str] = None
    status: Optional[str] = None
    profile_photo: Optional[str] = None
    biography: Optional[str] = None
    patients_assigned: Optional[int] = None
    success_rate: Optional[float] = None
    total_patients: Optional[int] = None

class DoctorOut(BaseModel):
    id: int
    doc_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    qualification: Optional[str] = None
    specialization: str
    experience_years: int
    department: Optional[str] = None
    hospital_name: str
    assigned_hospital_id: Optional[str] = None
    consultation_fee: Optional[float] = None
    available_days: Optional[str] = None
    available_time: Optional[str] = None
    status: Optional[str] = None
    profile_photo: Optional[str] = None
    biography: Optional[str] = None
    patients_assigned: Optional[int] = 0
    success_rate: float
    total_patients: int

    class Config:
        from_attributes = True

# Hospital Schemas
class HospitalCreate(BaseModel):
    hospital_id: Optional[str] = None
    name: str
    address: Optional[str] = None
    city: str
    state: Optional[str] = "NY"
    country: Optional[str] = "USA"
    email: Optional[str] = None
    phone: Optional[str] = None
    available_beds: Optional[int] = 50
    total_beds: int
    occupied_beds: int
    icu_beds: Optional[int] = 20
    departments_json: Optional[str] = None
    total_revenue: Optional[float] = 0.0
    rating: Optional[float] = 4.5
    doctors_count: Optional[int] = 15
    patients_count: Optional[int] = 250

class HospitalUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    available_beds: Optional[int] = None
    total_beds: Optional[int] = None
    occupied_beds: Optional[int] = None
    icu_beds: Optional[int] = None
    departments_json: Optional[str] = None
    total_revenue: Optional[float] = None
    rating: Optional[float] = None
    doctors_count: Optional[int] = None
    patients_count: Optional[int] = None

class HospitalOut(BaseModel):
    id: int
    hospital_id: str
    name: str
    address: Optional[str] = None
    city: str
    state: Optional[str] = None
    country: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    available_beds: Optional[int] = None
    total_beds: int
    occupied_beds: int
    icu_beds: Optional[int] = None
    departments_json: Optional[str] = None
    total_revenue: float
    rating: float
    doctors_count: int
    patients_count: int

    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentCreate(BaseModel):
    appointment_id: Optional[str] = None
    patient_id: Optional[str] = None
    doctor_id: Optional[str] = None
    hospital_id: Optional[str] = None
    patient_name: str
    doctor_name: str
    hospital_name: str
    department: Optional[str] = "General Medicine"
    appointment_date: str
    time_slot: str
    reason: Optional[str] = None
    status: Optional[str] = "Upcoming"

class AppointmentUpdate(BaseModel):
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    hospital_name: Optional[str] = None
    department: Optional[str] = None
    appointment_date: Optional[str] = None
    time_slot: Optional[str] = None
    reason: Optional[str] = None
    status: Optional[str] = None

class AppointmentOut(BaseModel):
    id: int
    appointment_id: str
    patient_id: Optional[str] = None
    doctor_id: Optional[str] = None
    hospital_id: Optional[str] = None
    patient_name: str
    doctor_name: str
    hospital_name: str
    department: str
    appointment_date: str
    time_slot: str
    reason: Optional[str] = None
    status: str

    class Config:
        from_attributes = True
