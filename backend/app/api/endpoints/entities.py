import random
from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.database import get_db
from app.database.models import Patient, Doctor, Hospital, Appointment, User, Notification, Prescription, LabReport
from app.core.security import get_password_hash
from app.schemas.schemas import (
    PatientOut, PatientCreate, PatientUpdate,
    DoctorOut, DoctorCreate, DoctorUpdate,
    HospitalOut, HospitalCreate, HospitalUpdate,
    AppointmentOut, AppointmentCreate, AppointmentUpdate
)

router = APIRouter(prefix="/entities", tags=["Healthcare Entities CRUD"])

# =====================================================================
# PATIENTS CRUD
# =====================================================================

@router.get("/patients", response_model=List[PatientOut])
def get_patients(
    search: Optional[str] = None,
    disease: Optional[str] = None,
    hospital: Optional[str] = None,
    gender: Optional[str] = None,
    city: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    doctor_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Patient)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Patient.name.ilike(pattern),
                Patient.patient_id.ilike(pattern),
                Patient.disease.ilike(pattern),
                Patient.city.ilike(pattern)
            )
        )
    if disease:
        query = query.filter(Patient.disease == disease)
    if hospital:
        query = query.filter(Patient.hospital_name == hospital)
    if gender:
        query = query.filter(Patient.gender == gender)
    if city:
        query = query.filter(Patient.city == city)
    if status_filter:
        query = query.filter(Patient.status == status_filter)
    if doctor_name:
        query = query.filter(Patient.doctor_name.ilike(f"%{doctor_name}%"))
    
    patients = query.order_by(Patient.id.desc()).all()
    return patients

@router.post("/patients", response_model=PatientOut, status_code=status.HTTP_201_CREATED)
def create_patient(patient_in: PatientCreate, db: Session = Depends(get_db)):
    if not patient_in.patient_id:
        patient_in.patient_id = f"PAT-{random.randint(1000, 9999)}"
    
    # Check duplicate patient_id
    existing = db.query(Patient).filter(Patient.patient_id == patient_in.patient_id).first()
    if existing:
        patient_in.patient_id = f"PAT-{random.randint(10000, 99999)}"

    # Auto-resolve doctor_id if doctor_name provided
    if patient_in.doctor_name:
        doc = db.query(Doctor).filter(Doctor.name.ilike(f"%{patient_in.doctor_name}%")).first()
        if doc:
            patient_in.assigned_doctor_id = doc.doc_id
            if not patient_in.assigned_hospital_id and doc.assigned_hospital_id:
                patient_in.assigned_hospital_id = doc.assigned_hospital_id
            if not patient_in.hospital_name and doc.hospital_name:
                patient_in.hospital_name = doc.hospital_name

    new_patient = Patient(**patient_in.model_dump())
    db.add(new_patient)

    # Automatic User Creation for Patient Login
    user_email = new_patient.email or f"{new_patient.name.lower().replace(' ', '.')}@healthflow.ai"
    if not new_patient.email:
        new_patient.email = user_email

    existing_user = db.query(User).filter(User.email.ilike(user_email)).first()
    if not existing_user:
        db.add(User(
            name=new_patient.name,
            email=user_email,
            hashed_password=get_password_hash("patient123"),
            role="Patient",
            department=new_patient.department or "General Medicine"
        ))

    # Sync patient count on hospital if matched
    if new_patient.hospital_name:
        hosp = db.query(Hospital).filter(Hospital.name.ilike(f"%{new_patient.hospital_name}%")).first()
        if hosp:
            hosp.patients_count = (hosp.patients_count or 0) + 1
            hosp.occupied_beds = min(hosp.total_beds, (hosp.occupied_beds or 0) + 1)
            hosp.available_beds = max(0, hosp.total_beds - hosp.occupied_beds)

    # Live Notifications
    notif = Notification(
        title="New Patient Created",
        message=f"Patient {new_patient.name} ({new_patient.patient_id}) created and assigned to {new_patient.doctor_name}.",
        type="info"
    )
    db.add(notif)

    db.commit()
    db.refresh(new_patient)
    return new_patient

@router.get("/patients/{patient_id_or_pk}", response_model=PatientOut)
def get_patient_by_id(patient_id_or_pk: str, db: Session = Depends(get_db)):
    if patient_id_or_pk.isdigit():
        p = db.query(Patient).filter(Patient.id == int(patient_id_or_pk)).first()
    else:
        p = db.query(Patient).filter(Patient.patient_id == patient_id_or_pk).first()
    
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    return p

@router.put("/patients/{pk}", response_model=PatientOut)
def update_patient(pk: int, patient_in: PatientUpdate, db: Session = Depends(get_db)):
    p = db.query(Patient).filter(Patient.id == pk).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient record not found")
    
    update_data = patient_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(p, field, val)

    # Auto sync User name/email if updated
    if p.email:
        u = db.query(User).filter(User.email.ilike(p.email)).first()
        if u:
            u.name = p.name

    db.commit()
    db.refresh(p)
    return p

@router.delete("/patients/{pk}")
def delete_patient(pk: int, db: Session = Depends(get_db)):
    p = db.query(Patient).filter(Patient.id == pk).first()
    if not p:
        raise HTTPException(status_code=404, detail="Patient record not found")
    
    db.delete(p)
    db.commit()
    return {"status": "success", "message": f"Patient record #{pk} deleted successfully"}


# =====================================================================
# DOCTORS CRUD
# =====================================================================

@router.get("/doctors", response_model=List[DoctorOut])
def get_doctors(
    search: Optional[str] = None,
    specialization: Optional[str] = None,
    hospital: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Doctor)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Doctor.name.ilike(pattern),
                Doctor.doc_id.ilike(pattern),
                Doctor.specialization.ilike(pattern),
                Doctor.department.ilike(pattern)
            )
        )
    if specialization:
        query = query.filter(Doctor.specialization == specialization)
    if hospital:
        query = query.filter(Doctor.hospital_name == hospital)

    doctors = query.order_by(Doctor.id.asc()).all()
    return doctors

@router.post("/doctors", response_model=DoctorOut, status_code=status.HTTP_201_CREATED)
def create_doctor(doctor_in: DoctorCreate, db: Session = Depends(get_db)):
    if not doctor_in.doc_id:
        doctor_in.doc_id = f"DOC-{random.randint(100, 999)}"
    
    existing = db.query(Doctor).filter(Doctor.doc_id == doctor_in.doc_id).first()
    if existing:
        doctor_in.doc_id = f"DOC-{random.randint(1000, 9999)}"

    new_doc = Doctor(**doctor_in.model_dump())
    db.add(new_doc)

    # Automatic User Creation for Doctor Login
    user_email = new_doc.email or f"{new_doc.name.lower().replace(' ', '.').replace('dr.', '')}@healthflow.ai"
    if not new_doc.email:
        new_doc.email = user_email

    existing_user = db.query(User).filter(User.email.ilike(user_email)).first()
    if not existing_user:
        db.add(User(
            name=new_doc.name,
            email=user_email,
            hashed_password=get_password_hash("doctor123"),
            role="Doctor",
            department=new_doc.department or "Cardiology"
        ))

    # Sync doctor count on hospital
    if new_doc.hospital_name:
        hosp = db.query(Hospital).filter(Hospital.name.ilike(f"%{new_doc.hospital_name}%")).first()
        if hosp:
            hosp.doctors_count = (hosp.doctors_count or 0) + 1
            if not new_doc.assigned_hospital_id:
                new_doc.assigned_hospital_id = hosp.hospital_id

    # Notification
    notif = Notification(
        title="New Doctor Added",
        message=f"Physician {new_doc.name} ({new_doc.doc_id}) registered in {new_doc.hospital_name}.",
        type="info"
    )
    db.add(notif)

    db.commit()
    db.refresh(new_doc)
    return new_doc

@router.get("/doctors/{pk}", response_model=DoctorOut)
def get_doctor_by_id(pk: int, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == pk).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doc

@router.put("/doctors/{pk}", response_model=DoctorOut)
def update_doctor(pk: int, doctor_in: DoctorUpdate, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == pk).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    update_data = doctor_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(doc, field, val)

    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/doctors/{pk}")
def delete_doctor(pk: int, db: Session = Depends(get_db)):
    doc = db.query(Doctor).filter(Doctor.id == pk).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Doctor record not found")
    
    db.delete(doc)
    db.commit()
    return {"status": "success", "message": f"Doctor record #{pk} deleted successfully"}


# =====================================================================
# HOSPITALS CRUD
# =====================================================================

@router.get("/hospitals", response_model=List[HospitalOut])
def get_hospitals(search: Optional[str] = None, city: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Hospital)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Hospital.name.ilike(pattern),
                Hospital.hospital_id.ilike(pattern),
                Hospital.city.ilike(pattern)
            )
        )
    if city:
        query = query.filter(Hospital.city == city)

    hospitals = query.order_by(Hospital.rating.desc()).all()
    return hospitals

@router.post("/hospitals", response_model=HospitalOut, status_code=status.HTTP_201_CREATED)
def create_hospital(hosp_in: HospitalCreate, db: Session = Depends(get_db)):
    if not hosp_in.hospital_id:
        hosp_in.hospital_id = f"HOSP-{random.randint(100, 999)}"
    
    new_hosp = Hospital(**hosp_in.model_dump())
    db.add(new_hosp)
    db.commit()
    db.refresh(new_hosp)
    return new_hosp

@router.get("/hospitals/{pk}", response_model=HospitalOut)
def get_hospital_by_id(pk: int, db: Session = Depends(get_db)):
    hosp = db.query(Hospital).filter(Hospital.id == pk).first()
    if not hosp:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return hosp

@router.put("/hospitals/{pk}", response_model=HospitalOut)
def update_hospital(pk: int, hosp_in: HospitalUpdate, db: Session = Depends(get_db)):
    hosp = db.query(Hospital).filter(Hospital.id == pk).first()
    if not hosp:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    update_data = hosp_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(hosp, field, val)

    db.commit()
    db.refresh(hosp)
    return hosp

@router.delete("/hospitals/{pk}")
def delete_hospital(pk: int, db: Session = Depends(get_db)):
    hosp = db.query(Hospital).filter(Hospital.id == pk).first()
    if not hosp:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    db.delete(hosp)
    db.commit()
    return {"status": "success", "message": f"Hospital record #{pk} deleted successfully"}


# =====================================================================
# APPOINTMENTS CRUD
# =====================================================================

@router.get("/appointments", response_model=List[AppointmentOut])
def get_appointments(
    status_filter: Optional[str] = Query(None, alias="status"),
    doctor_name: Optional[str] = None,
    patient_name: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Appointment)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(
                Appointment.patient_name.ilike(pattern),
                Appointment.doctor_name.ilike(pattern),
                Appointment.appointment_id.ilike(pattern),
                Appointment.department.ilike(pattern)
            )
        )
    if status_filter:
        query = query.filter(Appointment.status == status_filter)
    if doctor_name:
        query = query.filter(Appointment.doctor_name.ilike(f"%{doctor_name}%"))
    if patient_name:
        query = query.filter(Appointment.patient_name.ilike(f"%{patient_name}%"))

    appointments = query.order_by(Appointment.id.desc()).all()
    return appointments

@router.post("/appointments", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
def create_appointment(apt_in: AppointmentCreate, db: Session = Depends(get_db)):
    if not apt_in.appointment_id:
        apt_in.appointment_id = f"APT-{random.randint(9000, 9999)}"
    
    if apt_in.doctor_name and not apt_in.doctor_id:
        doc = db.query(Doctor).filter(Doctor.name.ilike(f"%{apt_in.doctor_name}%")).first()
        if doc:
            apt_in.doctor_id = doc.doc_id

    if apt_in.patient_name and not apt_in.patient_id:
        pat = db.query(Patient).filter(Patient.name.ilike(f"%{apt_in.patient_name}%")).first()
        if pat:
            apt_in.patient_id = pat.patient_id

    new_apt = Appointment(**apt_in.model_dump())
    db.add(new_apt)

    # Notification for appointment creation
    notif = Notification(
        title="Appointment Scheduled",
        message=f"Appointment {new_apt.appointment_id} booked for {new_apt.patient_name} with {new_apt.doctor_name} on {new_apt.appointment_date}.",
        type="info"
    )
    db.add(notif)

    db.commit()
    db.refresh(new_apt)
    return new_apt

@router.get("/appointments/{pk}", response_model=AppointmentOut)
def get_appointment_by_id(pk: int, db: Session = Depends(get_db)):
    apt = db.query(Appointment).filter(Appointment.id == pk).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return apt

@router.put("/appointments/{pk}", response_model=AppointmentOut)
def update_appointment(pk: int, apt_in: AppointmentUpdate, db: Session = Depends(get_db)):
    apt = db.query(Appointment).filter(Appointment.id == pk).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    update_data = apt_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(apt, field, val)

    db.commit()
    db.refresh(apt)
    return apt

@router.delete("/appointments/{pk}")
def delete_appointment(pk: int, db: Session = Depends(get_db)):
    apt = db.query(Appointment).filter(Appointment.id == pk).first()
    if not apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db.delete(apt)
    db.commit()
    return {"status": "success", "message": f"Appointment #{pk} deleted successfully"}


# =====================================================================
# GLOBAL UNIFIED SEARCH API
# =====================================================================

@router.get("/global-search")
def global_search(query: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    pattern = f"%{query}%"

    patients = db.query(Patient).filter(
        or_(
            Patient.name.ilike(pattern),
            Patient.patient_id.ilike(pattern),
            Patient.disease.ilike(pattern),
            Patient.city.ilike(pattern)
        )
    ).limit(5).all()

    doctors = db.query(Doctor).filter(
        or_(
            Doctor.name.ilike(pattern),
            Doctor.doc_id.ilike(pattern),
            Doctor.specialization.ilike(pattern),
            Doctor.department.ilike(pattern)
        )
    ).limit(5).all()

    hospitals = db.query(Hospital).filter(
        or_(
            Hospital.name.ilike(pattern),
            Hospital.hospital_id.ilike(pattern),
            Hospital.city.ilike(pattern)
        )
    ).limit(5).all()

    appointments = db.query(Appointment).filter(
        or_(
            Appointment.patient_name.ilike(pattern),
            Appointment.doctor_name.ilike(pattern),
            Appointment.appointment_id.ilike(pattern),
            Appointment.department.ilike(pattern)
        )
    ).limit(5).all()

    return {
        "query": query,
        "patients": [PatientOut.model_validate(p) for p in patients],
        "doctors": [DoctorOut.model_validate(d) for d in doctors],
        "hospitals": [HospitalOut.model_validate(h) for h in hospitals],
        "appointments": [AppointmentOut.model_validate(a) for a in appointments]
    }
