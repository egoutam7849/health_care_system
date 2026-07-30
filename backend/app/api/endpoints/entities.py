from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Patient, Doctor, Hospital, Appointment
from app.schemas.schemas import PatientOut, DoctorOut, HospitalOut, AppointmentOut

router = APIRouter(prefix="/entities", tags=["Healthcare Entities"])

@router.get("/patients")
def get_patients(
    search: Optional[str] = None,
    disease: Optional[str] = None,
    hospital: Optional[str] = None,
    gender: Optional[str] = None,
    city: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Patient)
    if search:
        query = query.filter((Patient.name.ilike(f"%{search}%")) | (Patient.patient_id.ilike(f"%{search}%")))
    if disease:
        query = query.filter(Patient.disease == disease)
    if hospital:
        query = query.filter(Patient.hospital_name == hospital)
    if gender:
        query = query.filter(Patient.gender == gender)
    if city:
        query = query.filter(Patient.city == city)
    
    patients = query.order_by(Patient.id.desc()).all()
    return [PatientOut.model_validate(p) for p in patients]

@router.get("/doctors")
def get_doctors(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Doctor)
    if search:
        query = query.filter((Doctor.name.ilike(f"%{search}%")) | (Doctor.specialization.ilike(f"%{search}%")))
    doctors = query.order_by(Doctor.id.asc()).all()
    return [DoctorOut.model_validate(d) for d in doctors]

@router.get("/hospitals")
def get_hospitals(db: Session = Depends(get_db)):
    hospitals = db.query(Hospital).order_by(Hospital.rating.desc()).all()
    return [HospitalOut.model_validate(h) for h in hospitals]

@router.get("/appointments")
def get_appointments(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Appointment)
    if status:
        query = query.filter(Appointment.status == status)
    appointments = query.order_by(Appointment.id.desc()).all()
    return [AppointmentOut.model_validate(a) for a in appointments]
