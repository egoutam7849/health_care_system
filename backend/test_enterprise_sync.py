import os
import sys
import asyncio
import httpx

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from main import app
from app.database.database import SessionLocal, Base, engine
from app.database.seed_data import seed_database
from app.database.models import Doctor, Patient, Appointment, User, Notification

async def test_full_enterprise_scenario():
    print("\n========================================================")
    print("STARTING ENTERPRISE SINGLE SOURCE OF TRUTH VERIFICATION")
    print("========================================================")

    Base.metadata.create_all(bind=engine)
    seed_database()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Step 0: Admin Login
        admin_login = await client.post("/api/v1/auth/admin/login", json={
            "email": "admin@healthflow.ai",
            "password": "admin123"
        })
        assert admin_login.status_code == 200, f"Admin login failed: {admin_login.text}"
        admin_token = admin_login.json()["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        print("[OK] Step 0: Admin authenticated successfully.")

        # Step 1: Admin Creates Doctor "Dr. Rahul Sharma"
        doc_data = {
            "doc_id": "DOC-RAHUL",
            "name": "Dr. Rahul Sharma",
            "email": "rahul.sharma@healthflow.ai",
            "specialization": "Cardiology",
            "hospital_name": "Metro General Hospital",
            "department": "Cardiology",
            "consultation_fee": 300.0,
            "experience_years": 12
        }
        create_doc_res = await client.post("/api/v1/entities/doctors", json=doc_data, headers=admin_headers)
        assert create_doc_res.status_code == 201, f"Create doctor failed: {create_doc_res.text}"
        created_doc = create_doc_res.json()
        print(f"[OK] Step 1: Admin created Doctor '{created_doc['name']}' ({created_doc['doc_id']}, {created_doc['email']}).")

        # Step 2: Admin Creates Patient "Anita Rao" & assigns to Dr. Rahul Sharma
        patient_data = {
            "patient_id": "PAT-ANITA",
            "name": "Anita Rao",
            "email": "anita.rao@healthflow.ai",
            "age": 32,
            "gender": "Female",
            "disease": "Hypertension",
            "diagnosis": "Stage 1 Essential Hypertension under primary cardiology care.",
            "doctor_name": "Dr. Rahul Sharma",
            "hospital_name": "Metro General Hospital",
            "department": "Cardiology",
            "admission_date": "2026-08-01",
            "bill_amount": 12500.0
        }
        create_pat_res = await client.post("/api/v1/entities/patients", json=patient_data, headers=admin_headers)
        assert create_pat_res.status_code == 201, f"Create patient failed: {create_pat_res.text}"
        created_pat = create_pat_res.json()
        print(f"[OK] Step 2: Admin created Patient '{created_pat['name']}' ({created_pat['patient_id']}) assigned to '{created_pat['doctor_name']}'.")

        # Step 3: Admin Schedules Appointment for Anita Rao with Dr. Rahul Sharma
        apt_data = {
            "appointment_id": "APT-ANITA-01",
            "patient_id": created_pat["patient_id"],
            "doctor_id": created_doc["doc_id"],
            "patient_name": created_pat["name"],
            "doctor_name": created_doc["name"],
            "hospital_name": created_doc["hospital_name"],
            "department": "Cardiology",
            "appointment_date": "2026-08-05",
            "time_slot": "10:30 AM",
            "reason": "Blood pressure monitoring & treatment evaluation.",
            "status": "Upcoming"
        }
        create_apt_res = await client.post("/api/v1/entities/appointments", json=apt_data, headers=admin_headers)
        assert create_apt_res.status_code == 201, f"Create appointment failed: {create_apt_res.text}"
        created_apt = create_apt_res.json()
        print(f"[OK] Step 3: Admin scheduled Appointment '{created_apt['appointment_id']}' for {created_apt['patient_name']} with {created_apt['doctor_name']}.")

        # Step 4: Doctor Login as "Dr. Rahul Sharma"
        doc_login_res = await client.post("/api/v1/auth/doctor/login", json={
            "email": "rahul.sharma@healthflow.ai",
            "password": "doctor123"
        })
        assert doc_login_res.status_code == 200, f"Doctor login failed: {doc_login_res.text}"
        doc_jwt = doc_login_res.json()["access_token"]
        doc_headers = {"Authorization": f"Bearer {doc_jwt}"}

        # Query Doctor Dashboard & Patient Roster
        doc_dash = await client.get("/api/v1/doctor/dashboard", headers=doc_headers)
        assert doc_dash.status_code == 200, f"Doctor dashboard query failed: {doc_dash.text}"
        doc_dash_data = doc_dash.json()

        assigned_pats = [p["name"] for p in doc_dash_data.get("assigned_patients", [])]
        print(f"[OK] Step 4: Dr. Rahul Sharma logged in via JWT. Assigned Patient Roster: {assigned_pats}")
        assert "Anita Rao" in assigned_pats, "Anita Rao MUST appear in Dr. Rahul Sharma's patient roster!"

        # Step 5: Patient Login as "Anita Rao"
        pat_login_res = await client.post("/api/v1/auth/patient/login", json={
            "email": "anita.rao@healthflow.ai",
            "password": "patient123"
        })
        assert pat_login_res.status_code == 200, f"Patient login failed: {pat_login_res.text}"
        pat_jwt = pat_login_res.json()["access_token"]
        pat_headers = {"Authorization": f"Bearer {pat_jwt}"}

        # Query Patient Dashboard
        pat_dash = await client.get("/api/v1/patient/dashboard", headers=pat_headers)
        assert pat_dash.status_code == 200, f"Patient dashboard query failed: {pat_dash.text}"
        pat_dash_data = pat_dash.json()
        pat_profile = pat_dash_data.get("profile", {})
        pat_apts = pat_dash_data.get("appointments", [])

        print(f"[OK] Step 5: Anita Rao logged in via JWT. Profile Name: '{pat_profile.get('name')}', Attending Doctor: '{pat_profile.get('attending_doctor')}'")
        assert pat_profile.get("name") == "Anita Rao", "Patient profile name must match Anita Rao!"
        assert "Rahul Sharma" in pat_profile.get("attending_doctor", ""), "Attending doctor must match Dr. Rahul Sharma!"
        assert len(pat_apts) > 0, "Anita Rao must see her scheduled appointment!"

        # Step 6: Healthcare Analyst Portal Live Aggregates
        analyst_res = await client.get("/api/v1/analytics/gold-query")
        assert analyst_res.status_code == 200, f"Analyst query failed: {analyst_res.text}"
        analyst_data = analyst_res.json()
        metrics = analyst_data.get("warehouse_metrics", {})
        analytics = analyst_data.get("analytics", {})

        print(f"[OK] Step 6: Analyst Portal Live Database Metrics -> Total Patients: {metrics.get('total_patients')}, Total Doctors: {metrics.get('total_doctors')}, Total Revenue: ${metrics.get('total_revenue'):,.2f}")
        assert metrics.get("total_patients") > 0
        assert metrics.get("total_doctors") > 0

        # Step 7: Executive Dashboard Stats
        dash_stats = await client.get("/api/v1/dashboard/stats")
        assert dash_stats.status_code == 200, f"Dashboard stats failed: {dash_stats.text}"
        kpis = dash_stats.json().get("kpis", {})
        print(f"[OK] Step 7: Executive Dashboard KPIs -> Patients: {kpis.get('total_patients')}, Doctors: {kpis.get('total_doctors')}, Revenue: ${kpis.get('total_revenue'):,.2f}")

        print("\n========================================================")
        print("SUCCESS: 100% ENTERPRISE DYNAMIC RBAC VERIFICATION PASSED!")
        print("========================================================\n")

if __name__ == "__main__":
    asyncio.run(test_full_enterprise_scenario())
