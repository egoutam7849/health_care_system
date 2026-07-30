from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import User
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
        # Demo fallback for testing
        if request.email == "admin@healthflow.ai" or "admin" in request.email:
            token = create_access_token({"sub": "admin@healthflow.ai", "role": "Admin"})
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

    token = create_access_token({"sub": user.email, "role": user.role})
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
def login_doctor(request: LoginRequest):
    token = create_access_token({"sub": request.email, "role": "Doctor"})
    refresh = f"refresh_{token[:24]}"
    return {
        "access_token": token,
        "refresh_token": refresh,
        "token_type": "bearer",
        "role": "Doctor",
        "redirect_url": "/doctor/dashboard",
        "user": {
            "name": "Dr. Alexander Wright",
            "email": request.email,
            "role": "Doctor",
            "specialization": "Cardiology",
            "hospital_name": "Metro General Hospital"
        }
    }

@router.post("/patient/login")
def login_patient(request: LoginRequest):
    token = create_access_token({"sub": request.email, "role": "Patient"})
    refresh = f"refresh_{token[:24]}"
    return {
        "access_token": token,
        "refresh_token": refresh,
        "token_type": "bearer",
        "role": "Patient",
        "redirect_url": "/patient/dashboard",
        "user": {
            "name": "Emily Watson",
            "email": request.email,
            "role": "Patient",
            "patient_id": "PAT-1001"
        }
    }

@router.post("/analyst/login")
def login_analyst(request: LoginRequest):
    token = create_access_token({"sub": request.email, "role": "Analyst"})
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
