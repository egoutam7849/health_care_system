import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.database import engine, Base, SessionLocal
from app.database.models import (
    User, Patient, Doctor, Hospital, Appointment,
    BronzeFile, SilverFile, GoldReport, ETLLog, PipelineRun,
    AirflowTaskRun, DataQualityMetric, Notification
)
from app.core.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "admin@healthflow.ai").first():
            print("Database already seeded.")
            return

        print("Seeding HealthFlow AI database with realistic healthcare enterprise datasets...")

        # 1. Admin User
        admin_user = User(
            name="Dr. Sarah Jenkins",
            email="admin@healthflow.ai",
            hashed_password=get_password_hash("admin123"),
            role="Admin & Lead Data Engineer",
            department="Enterprise Data Infrastructure"
        )
        db.add(admin_user)

        # 2. Hospitals
        hospitals_data = [
            ("HOSP-101", "Metro General Hospital", "100 Medical Center Way", "New York", "NY", "USA", "contact@metrogeneral.org", "+1 212-555-0100", 55, 450, 395, 30, '["Cardiology","Neurology","Emergency","Oncology"]', 14250000.0, 4.8, 45, 890),
            ("HOSP-102", "St. Jude Children & Research Hospital", "262 Danny Thomas Place", "Boston", "MA", "USA", "contact@stjude.org", "+1 617-555-0120", 40, 300, 260, 20, '["Pediatrics","Oncology","Genetics"]', 11800000.0, 4.9, 38, 640),
            ("HOSP-103", "Johns Hopkins Medical Center", "1800 Orleans St", "Baltimore", "MD", "USA", "contact@jhmi.edu", "+1 410-555-0130", 80, 600, 520, 45, '["Cardiology","Neurology","Surgeries","Orthopedics"]', 22500000.0, 4.9, 65, 1420),
            ("HOSP-104", "Mayo Clinic Healthcare System", "200 First St SW", "Rochester", "MN", "USA", "contact@mayo.edu", "+1 507-555-0140", 70, 550, 480, 35, '["Internal Medicine","Endocrinology","Gastroenterology"]', 19800000.0, 4.9, 58, 1210),
            ("HOSP-105", "Cleveland Health Institute", "9500 Euclid Ave", "Cleveland", "OH", "USA", "contact@cleveland.org", "+1 216-555-0150", 90, 400, 310, 25, '["Cardiology","Pulmonology","Rheumatology"]', 9800000.0, 4.6, 30, 590),
            ("HOSP-106", "Stanford Health Care Center", "300 Pasteur Dr", "Palo Alto", "CA", "USA", "contact@stanfordhealth.org", "+1 650-555-0160", 70, 480, 410, 30, '["Neurology","Cardiology","Oncology"]', 16400000.0, 4.7, 42, 830),
            ("HOSP-107", "Mount Sinai Hospital", "1 Gustave L. Levy Pl", "New York", "NY", "USA", "contact@mountsinai.org", "+1 212-555-0170", 55, 520, 465, 35, '["Gastroenterology","Cardiology","Surgeries"]', 18100000.0, 4.8, 50, 1050),
            ("HOSP-108", "UCLA Medical Center", "757 Westwood Blvd", "Los Angeles", "CA", "USA", "contact@uclahealth.org", "+1 310-555-0180", 60, 500, 440, 30, '["Endocrinology","Neurology","General Medicine"]', 17500000.0, 4.7, 48, 980)
        ]
        
        hospitals_list = []
        for h_id, name, addr, city, state, country, email, phone, av_beds, beds, occ, icu, depts, rev, rating, docs, pats in hospitals_data:
            h = Hospital(
                hospital_id=h_id, name=name, address=addr, city=city, state=state, country=country,
                email=email, phone=phone, available_beds=av_beds, total_beds=beds,
                occupied_beds=occ, icu_beds=icu, departments_json=depts, total_revenue=rev,
                rating=rating, doctors_count=docs, patients_count=pats
            )
            db.add(h)
            hospitals_list.append(name)

        # 3. Doctors
        doctors_data = [
            ("DOC-201", "Dr. Alexander Wright", "a.wright@metrohealth.org", "+1 555-0144", "MD, FACC", "Cardiology", 14, "Cardiology", "Metro General Hospital", "HOSP-101", 200.0, "Mon, Wed, Fri", "09:00 AM - 04:00 PM", "Active", "Lead Cardiologist with 14 years of interventional care experience.", 98.4, 340),
            ("DOC-202", "Dr. Elena Rostova", "e.rostova@jhmi.edu", "+1 555-0188", "MD, PhD", "Neurology", 18, "Neurology", "Johns Hopkins Medical Center", "HOSP-103", 250.0, "Tue, Thu, Sat", "10:00 AM - 05:00 PM", "Active", "Expert Neurologist specializing in neuro-degenerative diseases.", 99.1, 480),
            ("DOC-203", "Dr. Marcus Vance", "m.vance@mayo.edu", "+1 555-0199", "MD, FASCO", "Oncology", 12, "Oncology", "Mayo Clinic Healthcare System", "HOSP-104", 220.0, "Mon, Tue, Thu", "08:30 AM - 03:30 PM", "Active", "Senior Clinical Oncologist specializing in targeted immunotherapy.", 96.8, 290),
            ("DOC-204", "Dr. Priya Sharma", "p.sharma@stjude.org", "+1 555-0122", "MD, FAAP", "Pediatrics", 10, "Pediatrics", "St. Jude Children & Research Hospital", "HOSP-102", 180.0, "Mon, Wed, Thu", "09:00 AM - 04:00 PM", "Active", "Pediatric Specialist committed to comprehensive childhood medical care.", 99.5, 510),
            ("DOC-205", "Dr. Robert Chen", "r.chen@cleveland.org", "+1 555-0155", "MD, FAAOS", "Orthopedics", 16, "Orthopedics", "Cleveland Health Institute", "HOSP-105", 210.0, "Wed, Fri", "08:00 AM - 04:00 PM", "Active", "Orthopedic Surgeon with expertise in joint replacement and trauma care.", 97.2, 380),
            ("DOC-206", "Dr. Sophia Martinez", "s.martinez@stanfordhealth.org", "+1 555-0177", "MD, FCCP", "Pulmonology", 9, "Pulmonology", "Stanford Health Care Center", "HOSP-106", 190.0, "Tue, Thu, Fri", "09:00 AM - 05:00 PM", "Active", "Pulmonologist specializing in chronic respiratory conditions and asthma.", 95.9, 230),
            ("DOC-207", "Dr. David Kim", "d.kim@mountsinai.org", "+1 555-0133", "MD, AGAF", "Gastroenterology", 11, "Gastroenterology", "Mount Sinai Hospital", "HOSP-107", 195.0, "Mon, Tue, Fri", "09:00 AM - 04:30 PM", "Active", "Gastroenterologist specializing in digestive health and endoscopic procedures.", 96.5, 310),
            ("DOC-208", "Dr. Hannah Taylor", "h.taylor@ucla.edu", "+1 555-0166", "MD, FACE", "Endocrinology", 15, "Endocrinology", "UCLA Medical Center", "HOSP-108", 205.0, "Mon, Wed, Thu", "10:00 AM - 04:00 PM", "Active", "Endocrinologist specializing in diabetes management and metabolic health.", 98.0, 420)
        ]

        doctors_list = []
        for d_id, name, email, phone, qual, spec, exp, dept, hosp, hosp_id, fee, days, times, st, bio, succ, pats in doctors_data:
            d = Doctor(
                doc_id=d_id, name=name, email=email, phone=phone, qualification=qual,
                specialization=spec, experience_years=exp, department=dept, hospital_name=hosp,
                assigned_hospital_id=hosp_id, consultation_fee=fee, available_days=days,
                available_time=times, status=st, biography=bio, success_rate=succ, total_patients=pats
            )
            db.add(d)
            doctors_list.append(name)

        # Add verification doctor: Dr. John Smith
        doc_smith = Doctor(
            doc_id="DOC-SMITH",
            name="Dr. John Smith",
            email="john.smith@healthflow.ai",
            phone="+1 555-0199",
            qualification="MD, FACC",
            specialization="Cardiology",
            experience_years=15,
            department="Cardiology",
            hospital_name="Metro General Hospital",
            assigned_hospital_id="HOSP-101",
            consultation_fee=250.0,
            available_days="Mon, Tue, Wed, Thu, Fri",
            available_time="09:00 AM - 05:00 PM",
            status="Active",
            biography="Lead Cardiologist specializing in interventional cardiology and patient care.",
            success_rate=98.8,
            total_patients=450
        )
        db.add(doc_smith)
        doctors_list.append("Dr. John Smith")

        # 4. Patients
        diseases = ["Cardiovascular Disease", "Diabetes Mellitus Type II", "Pneumonia", "Hypertension", "Acute Bronchitis", "Osteoarthritis", "Chronic Kidney Disease", "Asthma"]
        genders = ["Male", "Female"]
        cities = ["New York", "Boston", "Baltimore", "Rochester", "Cleveland", "Palo Alto", "Los Angeles"]
        statuses = ["Discharged", "Admitted", "Recovered", "Readmitted"]
        blood_groups = ["A+", "A-", "B+", "B-", "AB+", "O+", "O-"]
        insurances = ["BlueCross BlueShield", "Aetna Health", "UnitedHealthcare", "Kaiser Permanente", "Cigna"]

        # Add Verification Patients (Alice & Bob -> Dr. John Smith; Charlie -> Dr. Elena Rostova)
        p_alice = Patient(
            patient_id="PAT-ALICE",
            name="Alice Johnson",
            date_of_birth="1988-04-12",
            age=38,
            gender="Female",
            blood_group="A+",
            phone="+1 555-0101",
            email="alice@healthflow.ai",
            address="123 Maple Street",
            city="New York",
            state="NY",
            emergency_contact="Robert Johnson (+1 555-0901)",
            insurance_provider="BlueCross BlueShield",
            insurance_number="INS-88101",
            assigned_doctor_id="DOC-SMITH",
            assigned_hospital_id="HOSP-101",
            doctor_name="Dr. John Smith",
            hospital_name="Metro General Hospital",
            department="Cardiology",
            disease="Hypertension",
            diagnosis="Essential primary hypertension with routine monitoring.",
            admission_date="2026-07-15",
            discharge_date="2026-07-20",
            status="Admitted",
            medical_history="No prior surgical history.",
            bill_amount=14500.0,
            is_readmitted=False
        )
        p_bob = Patient(
            patient_id="PAT-BOB",
            name="Bob Williams",
            date_of_birth="1975-09-24",
            age=51,
            gender="Male",
            blood_group="O+",
            phone="+1 555-0102",
            email="bob@healthflow.ai",
            address="456 Oak Drive",
            city="New York",
            state="NY",
            emergency_contact="Sarah Williams (+1 555-0902)",
            insurance_provider="Aetna Health",
            insurance_number="INS-88102",
            assigned_doctor_id="DOC-SMITH",
            assigned_hospital_id="HOSP-101",
            doctor_name="Dr. John Smith",
            hospital_name="Metro General Hospital",
            department="Cardiology",
            disease="Cardiovascular Disease",
            diagnosis="Coronary artery disease under medical management.",
            admission_date="2026-07-10",
            discharge_date="2026-07-18",
            status="Admitted",
            medical_history="Mild asthma in childhood.",
            bill_amount=18200.0,
            is_readmitted=False
        )
        p_charlie = Patient(
            patient_id="PAT-CHARLIE",
            name="Charlie Brown",
            date_of_birth="1992-12-05",
            age=34,
            gender="Male",
            blood_group="B+",
            phone="+1 555-0103",
            email="charlie@healthflow.ai",
            address="789 Pine Avenue",
            city="Baltimore",
            state="MD",
            emergency_contact="Lucy Brown (+1 555-0903)",
            insurance_provider="UnitedHealthcare",
            insurance_number="INS-88103",
            assigned_doctor_id="DOC-202",
            assigned_hospital_id="HOSP-103",
            doctor_name="Dr. Elena Rostova",
            hospital_name="Johns Hopkins Medical Center",
            department="Neurology",
            disease="Pneumonia",
            diagnosis="Acute lobar pneumonia treated with IV antibiotics.",
            admission_date="2026-07-02",
            discharge_date="2026-07-09",
            status="Discharged",
            medical_history="Allergic to penicillin.",
            bill_amount=9800.0,
            is_readmitted=False
        )
        db.add(p_alice)
        db.add(p_bob)
        db.add(p_charlie)

        patient_names = [
            "Emily Watson", "James Carter", "Olivia Davis", "Liam Wilson",
            "Sophia Miller", "Noah Taylor", "Isabella Anderson", "Ethan Thomas",
            "Mia Jackson", "Lucas White", "Harper Harris", "Benjamin Martin",
            "Charlotte Thompson", "Oliver Garcia", "Amelia Martinez", "Henry Robinson",
            "Evelyn Clark", "Alexander Rodriguez", "Abigail Lewis", "Daniel Lee"
        ]

        today = datetime.now()

        for i, name in enumerate(patient_names, start=1001):
            adm_days_ago = random.randint(5, 60)
            adm_date = (today - timedelta(days=adm_days_ago)).strftime("%Y-%m-%d")
            dis_days_ago = max(1, adm_days_ago - random.randint(2, 10))
            dis_date = (today - timedelta(days=dis_days_ago)).strftime("%Y-%m-%d")
            dob_year = today.year - random.randint(22, 84)
            dob_date = f"{dob_year}-{random.randint(1,12):02d}-{random.randint(1,28):02d}"
            
            p = Patient(
                patient_id=f"PAT-{i}",
                name=name,
                date_of_birth=dob_date,
                age=random.randint(22, 84),
                gender=random.choice(genders),
                blood_group=random.choice(blood_groups),
                phone=f"+1 555-01{random.randint(10, 99)}",
                email=f"{name.lower().replace(' ', '.')}@healthflow.ai",
                address=f"{random.randint(100, 999)} Park Avenue",
                city=random.choice(cities),
                state="NY",
                emergency_contact=f"Family (+1 555-09{random.randint(10, 99)})",
                insurance_provider=random.choice(insurances),
                insurance_number=f"INS-{random.randint(10000, 99999)}",
                doctor_name=random.choice(doctors_list),
                hospital_name=random.choice(hospitals_list),
                department="Cardiology" if "Cardio" in diseases[0] else "General Medicine",
                disease=random.choice(diseases),
                diagnosis=f"Clinical observation & inpatient treatment for {random.choice(diseases)}.",
                admission_date=adm_date,
                discharge_date=dis_date,
                status=random.choice(statuses),
                medical_history="No prior major surgical complications noted.",
                bill_amount=round(random.uniform(2500.0, 48000.0), 2),
                is_readmitted=random.choice([True, False, False, False])
            )
            db.add(p)

        # 5. Appointments
        apt_statuses = ["Completed", "Upcoming", "Cancelled"]
        departments = ["Cardiology", "Neurology", "Oncology", "Pediatrics", "Orthopedics", "Pulmonology"]

        # Explicit Verification Appointments
        db.add(Appointment(
            appointment_id="APT-ALICE-01",
            patient_id="PAT-ALICE",
            doctor_id="DOC-SMITH",
            hospital_id="HOSP-101",
            patient_name="Alice Johnson",
            doctor_name="Dr. John Smith",
            hospital_name="Metro General Hospital",
            appointment_date=(today + timedelta(days=2)).strftime("%Y-%m-%d"),
            time_slot="10:00 AM",
            reason="Hypertension follow-up & blood pressure check.",
            status="Upcoming",
            department="Cardiology"
        ))
        db.add(Appointment(
            appointment_id="APT-BOB-01",
            patient_id="PAT-BOB",
            doctor_id="DOC-SMITH",
            hospital_id="HOSP-101",
            patient_name="Bob Williams",
            doctor_name="Dr. John Smith",
            hospital_name="Metro General Hospital",
            appointment_date=(today + timedelta(days=3)).strftime("%Y-%m-%d"),
            time_slot="02:00 PM",
            reason="Cardiovascular consultation & ECG review.",
            status="Upcoming",
            department="Cardiology"
        ))
        db.add(Appointment(
            appointment_id="APT-CHARLIE-01",
            patient_id="PAT-CHARLIE",
            doctor_id="DOC-202",
            hospital_id="HOSP-103",
            patient_name="Charlie Brown",
            doctor_name="Dr. Elena Rostova",
            hospital_name="Johns Hopkins Medical Center",
            appointment_date=(today + timedelta(days=5)).strftime("%Y-%m-%d"),
            time_slot="11:30 AM",
            reason="Neurology follow-up & chest X-ray evaluation.",
            status="Upcoming",
            department="Neurology"
        ))

        for i in range(1, 15):
            apt_date = (today + timedelta(days=random.randint(-10, 15))).strftime("%Y-%m-%d")
            apt = Appointment(
                appointment_id=f"APT-90{i:02d}",
                patient_id=f"PAT-10{i:02d}",
                doctor_id=f"DOC-20{(i % 8) + 1}",
                hospital_id=f"HOSP-10{(i % 8) + 1}",
                patient_name=random.choice(patient_names),
                doctor_name=random.choice(doctors_list),
                hospital_name=random.choice(hospitals_list),
                appointment_date=apt_date,
                time_slot=f"{random.randint(9, 16)}:00 AM" if random.choice([True, False]) else f"{random.randint(1, 4)}:00 PM",
                reason="Routine specialist consultation and follow-up review.",
                status=random.choice(apt_statuses),
                department=random.choice(departments)
            )
            db.add(apt)

        # 6. Bronze Files
        b1 = BronzeFile(
            filename="raw_healthcare_admissions_2026_q2.csv",
            source="Electronic Health Record (EHR) Feed",
            file_format="CSV",
            row_count=10000,
            column_count=18,
            file_size_kb=2450.5,
            storage_path="uploads/bronze/raw_healthcare_admissions_2026_q2.csv",
            schema_json='{"patient_id": "string", "name": "string", "age": "int64", "gender": "string", "disease": "string", "admission_date": "string", "bill_amount": "float64"}'
        )
        b2 = BronzeFile(
            filename="raw_hospital_billing_extract.parquet",
            source="Financial Enterprise Warehouse",
            file_format="Parquet",
            row_count=8500,
            column_count=12,
            file_size_kb=1820.0,
            storage_path="uploads/bronze/raw_hospital_billing_extract.parquet",
            schema_json='{"billing_id": "string", "patient_id": "string", "hospital": "string", "cost": "double", "paid_status": "boolean"}'
        )
        db.add(b1)
        db.add(b2)

        # 7. Silver Files
        s1 = SilverFile(
            bronze_filename="raw_healthcare_admissions_2026_q2.csv",
            silver_filename="silver_cleaned_healthcare_admissions.parquet",
            duplicates_removed=142,
            nulls_imputed=38,
            invalid_records_dropped=15,
            total_valid_rows=9805,
            cleaning_logs="Deduplicated on patient_id; Handled missing ages with median; Standardized dates YYYY-MM-DD; Dropped negative bill amounts.",
            storage_path="uploads/silver/silver_cleaned_healthcare_admissions.parquet"
        )
        db.add(s1)

        # 8. Gold Reports
        g1 = GoldReport(
            report_name="gold_monthly_hospital_revenue_summary",
            category="Revenue Trend",
            record_count=12,
            metrics_summary="Total Q2 Healthcare Revenue: $118.6M; Top Revenue Hospital: Johns Hopkins ($22.5M).",
            storage_path="uploads/gold/gold_monthly_hospital_revenue_summary.parquet"
        )
        g2 = GoldReport(
            report_name="gold_disease_distribution_and_readmission",
            category="Disease Analytics",
            record_count=8,
            metrics_summary="Cardiovascular disease accounts for 32% of admissions with a 6.4% readmission rate.",
            storage_path="uploads/gold/gold_disease_distribution_and_readmission.parquet"
        )
        db.add(g1)
        db.add(g2)

        # 9. Pipeline Runs & ETL Logs
        p_run1 = PipelineRun(
            run_id="RUN-20260730-001",
            dataset_name="raw_healthcare_admissions_2026_q2.csv",
            status="COMPLETED",
            records_processed=9805,
            execution_time_sec=14.2,
            bronze_status="COMPLETED",
            silver_status="COMPLETED",
            gold_status="COMPLETED"
        )
        db.add(p_run1)

        logs_data = [
            ("RUN-20260730-001", "Bronze Ingestion", "SUCCESS", "Uploaded dataset validated & parsed to Bronze storage format.", 1.2),
            ("RUN-20260730-001", "PySpark Cleaning Engine", "SUCCESS", "Removed 142 duplicates, imputed 38 null values, validated schemas.", 5.8),
            ("RUN-20260730-001", "Silver Transformation", "SUCCESS", "Converted date formats to ISO-8601, stored output in Silver Parquet.", 3.1),
            ("RUN-20260730-001", "Gold Aggregations", "SUCCESS", "Computed disease frequency, readmission KPIs, hospital revenue summaries.", 2.9),
            ("RUN-20260730-001", "PostgreSQL/SQLite Sync", "SUCCESS", "Populated analytical data warehouse tables successfully.", 1.2)
        ]
        for rid, step, st, msg, dur in logs_data:
            db.add(ETLLog(pipeline_run_id=rid, step=step, status=st, message=msg, duration_sec=dur))

        # 10. Airflow Task Runs
        airflow_tasks = [
            ("healthcare_medallion_etl_dag", "ingest_raw_bronze_task", "success", 2.1),
            ("healthcare_medallion_etl_dag", "pyspark_silver_clean_task", "success", 6.4),
            ("healthcare_medallion_etl_dag", "gold_business_aggregations_task", "success", 4.2),
            ("healthcare_medallion_etl_dag", "data_quality_assertion_task", "success", 1.8),
            ("healthcare_medallion_etl_dag", "refresh_warehouse_dashboard_task", "success", 1.1),
            ("daily_data_quality_check_dag", "schema_validation_rule_task", "success", 0.9),
            ("daily_data_quality_check_dag", "null_and_duplicate_scan_task", "success", 1.4),
        ]
        for dag_id, task_id, state, dur in airflow_tasks:
            db.add(AirflowTaskRun(
                dag_id=dag_id, task_id=task_id, execution_date=today.strftime("%Y-%m-%d %H:%M:%S"),
                state=state, duration_sec=dur
            ))

        # 11. Data Quality Metrics
        quality_rules = [
            ("Primary Key Uniqueness", "Duplicate Check", 9805, 0, 100.0, "PASSED"),
            ("Non-Null Patient Names & IDs", "Null Check", 9805, 0, 100.0, "PASSED"),
            ("Non-Negative Bill Amount Check", "Range Check", 9805, 0, 100.0, "PASSED"),
            ("Valid Admission Date ISO Format", "Schema Validation", 9805, 0, 100.0, "PASSED"),
            ("Age Within Human Range (0-120)", "Range Check", 9798, 7, 99.9, "PASSED"),
            ("Hospital Foreign Key Integrity", "Consistency Check", 9805, 0, 100.0, "PASSED")
        ]
        for rule, cat, p_cnt, f_cnt, pct, status in quality_rules:
            db.add(DataQualityMetric(
                rule_name=rule, category=cat, pass_count=p_cnt, fail_count=f_cnt,
                pass_percentage=pct, status=status
            ))

        # 12. Notifications
        db.add(Notification(
            title="ETL Medallion Pipeline Completed",
            message="Dataset 'raw_healthcare_admissions_2026_q2.csv' successfully transformed into Gold tables.",
            type="success"
        ))
        db.add(Notification(
            title="Data Quality Check Passed",
            message="Overall Data Quality Score: 99.8%. 0 critical schema errors found.",
            type="info"
        ))

        db.commit()
        print("Database seed successfully completed!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
