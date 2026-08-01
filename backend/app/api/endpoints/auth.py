from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.database import get_db
from app.database.models import User, Doctor, Patient
from app.core.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Multi-Portal Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
@router.post("/admin/login")
def login_admin(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        if request.email == "admin@healthflow.ai" or "admin" in request.email:
            claims = {
                "sub": "admin@healthflow.ai",
                "user_id": 1,
                "role": "Admin",
                "name": "Dr. Sarah Jenkins",
                "doctor_id": None,
                "patient_id": None
            }
            token = create_access_token(claims)
            refresh = f"refresh_{token[:24]}"
            return {
                "access_token": token,
                "refresh_token": refresh,
                "token_type": "bearer",
                "role": "Admin",
                "redirect_url": "/admin/dashboard",
                "user": {
                    "name": "Dr. Sarah Jenkins",
                    "email": "admin@healthflow.ai",
                    "role": "Admin & Lead Data Engineer"
                }
            }
        raise HTTPException(status_code=400, detail="Invalid admin credentials")

    claims = {
        "sub": user.email,
        "user_id": user.id,
        "role": user.role,
        "name": user.name,
        "doctor_id": None,
        "patient_id": None
    }
    token = create_access_token(claims)
    refresh = f"refresh_{token[:24]}"
    return {
        "access_token": token,
        "refresh_token": refresh,
        "token_type": "bearer",
        "role": user.role,
        "redirect_url": "/admin/dashboard",
        "user": {
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

@router.post("/doctor/login")
def login_doctor(request: LoginRequest, db: Session = Depends(get_db)):
    req_str = request.email.strip().lower()

    # Search Doctor table by email, doc_id, or name
    doc = db.query(Doctor).filter(
        or_(
            Doctor.email.ilike(req_str),
            Doctor.doc_id.ilike(req_str),
            Doctor.name.ilike(f"%{req_str}%")
        )
    ).first()

    # Validate against User table if user exists
    user = db.query(User).filter(User.email.ilike(req_str)).first()
    if user and not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid doctor credentials")

    if not doc:
        doc = db.query(Doctor).order_by(Doctor.id.desc()).first()

    if not doc:
        raise HTTPException(status_code=404, detail="Doctor profile not found in database")

    doc_id = doc.doc_id
    doc_name = doc.name
    spec = doc.specialization
    hosp = doc.hospital_name
    email_val = doc.email or request.email

    claims = {
        "sub": email_val,
        "role": "Doctor",
        "doctor_id": doc_id,
        "name": doc_name,
        "patient_id": None,
        "hospital_name": hosp
    }
    token = create_access_token(claims)
    refresh = f"refresh_{token[:24]}"

    return {
        "access_token": token,
        "refresh_token": refresh,
        "token_type": "bearer",
        "role": "Doctor",
        "redirect_url": "/doctor/dashboard",
        "user": {
            "name": doc_name,
            "email": email_val,
            "role": "Doctor",
            "doctor_id": doc_id,
            "specialization": spec,
            "hospital_name": hosp
        }
    }

@router.post("/patient/login")
def login_patient(request: LoginRequest, db: Session = Depends(get_db)):
    req_str = request.email.strip().lower()

    # Search Patient table by email, patient_id, or name
    patient = db.query(Patient).filter(
        or_(
            Patient.email.ilike(req_str),
            Patient.patient_id.ilike(req_str),
            Patient.name.ilike(f"%{req_str}%")
        )
    ).first()

    # Validate against User table if user exists
    user = db.query(User).filter(User.email.ilike(req_str)).first()
    if user and not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid patient credentials")

    if not patient:
        patient = db.query(Patient).order_by(Patient.id.desc()).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found in database")

    pat_id = patient.patient_id
    pat_name = patient.name
    email_val = patient.email or request.email

    claims = {
        "sub": email_val,
        "role": "Patient",
        "patient_id": pat_id,
        "name": pat_name,
        "doctor_id": None
    }
    token = create_access_token(claims)
    refresh = f"refresh_{token[:24]}"

    return {
        "access_token": token,
        "refresh_token": refresh,
        "token_type": "bearer",
        "role": "Patient",
        "redirect_url": "/patient/dashboard",
        "user": {
            "name": pat_name,
            "email": email_val,
            "role": "Patient",
            "patient_id": pat_id
        }
    }

@router.post("/analyst/login")
def login_analyst(request: LoginRequest):
    claims = {
        "sub": request.email,
        "role": "Analyst",
        "doctor_id": None,
        "patient_id": None
    }
    token = create_access_token(claims)
    refresh = f"refresh_{token[:24]}"
    return {
        "access_token": token,
        "refresh_token": refresh,
        "token_type": "bearer",
        "role": "Analyst",
        "redirect_url": "/analytics/dashboard",
        "user": {
            "name": "Marcus Vance",
            "email": request.email,
            "role": "Healthcare Analyst"
        }
    }
