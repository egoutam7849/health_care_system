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
            ("HOSP-101", "Metro General Hospital", "New York", 450, 395, 14250000.0, 4.8, 45, 890),
            ("HOSP-102", "St. Jude Children & Research Hospital", "Boston", 300, 260, 11800000.0, 4.9, 38, 640),
            ("HOSP-103", "Johns Hopkins Medical Center", "Baltimore", 600, 520, 22500000.0, 4.9, 65, 1420),
            ("HOSP-104", "Mayo Clinic Healthcare System", "Rochester", 550, 480, 19800000.0, 4.9, 58, 1210),
            ("HOSP-105", "Cleveland Health Institute", "Cleveland", 400, 310, 9800000.0, 4.6, 30, 590),
            ("HOSP-106", "Stanford Health Care Center", "Palo Alto", 480, 410, 16400000.0, 4.7, 42, 830),
            ("HOSP-107", "Mount Sinai Hospital", "New York", 520, 465, 18100000.0, 4.8, 50, 1050),
            ("HOSP-108", "UCLA Medical Center", "Los Angeles", 500, 440, 17500000.0, 4.7, 48, 980)
        ]
        
        hospitals_list = []
        for h_id, name, city, beds, occ, rev, rating, docs, pats in hospitals_data:
            h = Hospital(
                hospital_id=h_id, name=name, city=city, total_beds=beds,
                occupied_beds=occ, total_revenue=rev, rating=rating,
                doctors_count=docs, patients_count=pats
            )
            db.add(h)
            hospitals_list.append(name)

        # 3. Doctors
        doctors_data = [
            ("DOC-201", "Dr. Alexander Wright", "Cardiology", "Metro General Hospital", 14, 98.4, 340, "a.wright@metrohealth.org", "+1 555-0144"),
            ("DOC-202", "Dr. Elena Rostova", "Neurology", "Johns Hopkins Medical Center", 18, 99.1, 480, "e.rostova@jhmi.edu", "+1 555-0188"),
            ("DOC-203", "Dr. Marcus Vance", "Oncology", "Mayo Clinic Healthcare System", 12, 96.8, 290, "m.vance@mayo.edu", "+1 555-0199"),
            ("DOC-204", "Dr. Priya Sharma", "Pediatrics", "St. Jude Children & Research Hospital", 10, 99.5, 510, "p.sharma@stjude.org", "+1 555-0122"),
            ("DOC-205", "Dr. Robert Chen", "Orthopedics", "Cleveland Health Institute", 16, 97.2, 380, "r.chen@cleveland.org", "+1 555-0155"),
            ("DOC-206", "Dr. Sophia Martinez", "Pulmonology", "Stanford Health Care Center", 9, 95.9, 230, "s.martinez@stanfordhealth.org", "+1 555-0177"),
            ("DOC-207", "Dr. David Kim", "Gastroenterology", "Mount Sinai Hospital", 11, 96.5, 310, "d.kim@mountsinai.org", "+1 555-0133"),
            ("DOC-208", "Dr. Hannah Taylor", "Endocrinology", "UCLA Medical Center", 15, 98.0, 420, "h.taylor@ucla.edu", "+1 555-0166")
        ]

        doctors_list = []
        for d_id, name, spec, hosp, exp, succ, pats, email, phone in doctors_data:
            d = Doctor(
                doc_id=d_id, name=name, specialization=spec, hospital_name=hosp,
                experience_years=exp, success_rate=succ, total_patients=pats,
                email=email, phone=phone
            )
            db.add(d)
            doctors_list.append(name)

        # 4. Patients
        diseases = ["Cardiovascular Disease", "Diabetes Mellitus Type II", "Pneumonia", "Hypertension", "Acute Bronchitis", "Osteoarthritis", "Chronic Kidney Disease", "Asthma"]
        genders = ["Male", "Female"]
        cities = ["New York", "Boston", "Baltimore", "Rochester", "Cleveland", "Palo Alto", "Los Angeles"]
        statuses = ["Discharged", "Admitted", "Recovered", "Readmitted"]

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
            
            p = Patient(
                patient_id=f"PAT-{i}",
                name=name,
                age=random.randint(22, 84),
                gender=random.choice(genders),
                disease=random.choice(diseases),
                hospital_name=random.choice(hospitals_list),
                doctor_name=random.choice(doctors_list),
                admission_date=adm_date,
                discharge_date=dis_date,
                bill_amount=round(random.uniform(2500.0, 48000.0), 2),
                city=random.choice(cities),
                status=random.choice(statuses),
                is_readmitted=random.choice([True, False, False, False])
            )
            db.add(p)

        # 5. Appointments
        apt_statuses = ["Completed", "Upcoming", "Cancelled"]
        departments = ["Cardiology", "Neurology", "Oncology", "Pediatrics", "Orthopedics", "Pulmonology"]

        for i in range(1, 15):
            apt_date = (today + timedelta(days=random.randint(-10, 15))).strftime("%Y-%m-%d")
            apt = Appointment(
                appointment_id=f"APT-90{i:02d}",
                patient_name=random.choice(patient_names),
                doctor_name=random.choice(doctors_list),
                hospital_name=random.choice(hospitals_list),
                appointment_date=apt_date,
                time_slot=f"{random.randint(9, 16)}:00 AM" if random.choice([True, False]) else f"{random.randint(1, 4)}:00 PM",
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
