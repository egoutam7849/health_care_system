from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Patient, Doctor, Appointment, FactRevenue, DimHospital

router = APIRouter(prefix="/portals", tags=["Dedicated Portal APIs"])

@router.get("/patient/summary")
def get_patient_portal_summary(db: Session = Depends(get_db)):
    p = db.query(Patient).first()
    return {
        "profile": {
            "patient_id": p.patient_id if p else "PAT-1001",
            "name": p.name if p else "Emily Watson",
            "age": p.age if p else 48,
            "gender": p.gender if p else "Female",
            "blood_type": "O+",
            "city": p.city if p else "New York",
            "primary_hospital": p.hospital_name if p else "Metro General Hospital",
            "attending_doctor": p.doctor_name if p else "Dr. Alexander Wright"
        },
        "medical_history": [
            { "date": "2026-06-12", "condition": "Cardiovascular Disease", "facility": "Metro General Hospital", "status": "Managed" },
            { "date": "2025-11-04", "condition": "Routine Checkup", "facility": "Metro General Hospital", "status": "Completed" }
        ],
        "appointments": [
            { "id": "APT-901", "doctor": "Dr. Alexander Wright", "department": "Cardiology", "date": "2026-08-04", "time": "10:30 AM", "status": "Upcoming" },
            { "id": "APT-882", "doctor": "Dr. Emily Vance", "department": "Endocrinology", "date": "2026-06-12", "time": "02:00 PM", "status": "Completed" }
        ],
        "prescriptions": [
            { "medication": "Atorvastatin 20mg", "dosage": "Once Daily at Bedtime", "doctor": "Dr. Alexander Wright", "refills_remaining": 3 },
            { "medication": "Lisinopril 10mg", "dosage": "Once Daily Morning", "doctor": "Dr. Alexander Wright", "refills_remaining": 2 }
        ],
        "billing_history": [
            { "invoice_id": "INV-2026-044", "date": "2026-06-19", "description": "Inpatient Cardiology Care & Diagnostics", "amount": 18500.0, "insurance_covered": 16650.0, "patient_paid": 1850.0, "status": "PAID" }
        ]
    }

@router.get("/doctor/patients")
def get_doctor_portal_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).limit(10).all()
    appointments = db.query(Appointment).limit(10).all()
    return {
        "doctor_info": {
            "name": "Dr. Alexander Wright",
            "specialization": "Cardiology",
            "hospital": "Metro General Hospital",
            "experience": "14 Years",
            "active_patients": 42
        },
        "today_schedule": [
            { "id": "APT-901", "patient_name": "Emily Watson", "time": "09:00 AM", "type": "Follow-up Consultation", "status": "Confirmed" },
            { "id": "APT-902", "patient_name": "Johnathan Miller", "time": "10:30 AM", "type": "Echocardiogram Review", "status": "Confirmed" },
            { "id": "APT-903", "patient_name": "Marcus Aurelius", "time": "01:30 PM", "type": "Post-op Review", "status": "Pending" }
        ],
        "assigned_patients": [{
            "id": p.patient_id,
            "name": p.name,
            "age": p.age,
            "gender": p.gender,
            "condition": p.disease,
            "admission_date": p.admission_date
        } for p in patients]
    }

@router.get("/analytics/gold-query")
def get_analyst_portal_data(db: Session = Depends(get_db)):
    return {
        "gold_tables": [
            { "table_name": "FactAdmissions", "rows": 441225, "layer": "Star Schema Warehouse" },
            { "table_name": "FactRevenue", "rows": 12, "layer": "Star Schema Warehouse" },
            { "table_name": "hospital_summary.parquet", "rows": 8, "layer": "Gold Medallion Storage" }
        ],
        "warehouse_metrics": {
            "total_revenue": 128500000.0,
            "avg_stay_days": 5.4,
            "readmission_rate": 6.2
        }
    }
