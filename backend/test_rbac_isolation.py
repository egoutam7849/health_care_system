import os
import sys
import asyncio
import httpx

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from main import app
from app.database.database import SessionLocal, Base, engine
from app.database.seed_data import seed_database

async def run_rbac_tests():
    Base.metadata.create_all(bind=engine)
    seed_database()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        print("Starting RBAC Data Isolation Verification...")

        # 1. Doctor John Smith Isolation
        res = await client.post("/api/v1/auth/doctor/login", json={
            "email": "john.smith@healthflow.ai",
            "password": "doctor123"
        })
        assert res.status_code == 200, f"Doctor login failed: {res.text}"
        data = res.json()
        token = data["access_token"]
        assert data["role"] == "Doctor"
        assert data["user"]["doctor_id"] == "DOC-SMITH"

        headers = {"Authorization": f"Bearer {token}"}
        p_res = await client.get("/api/v1/doctor/patients", headers=headers)
        assert p_res.status_code == 200, f"Get doctor patients failed: {p_res.text}"
        p_data = p_res.json()
        patient_ids = [p["id"] for p in p_data.get("assigned_patients", [])]
        patient_names = [p["name"] for p in p_data.get("assigned_patients", [])]

        print("1. Dr. John Smith assigned patients:", patient_names, patient_ids)
        assert "PAT-ALICE" in patient_ids, "Alice should be assigned to Dr. John Smith"
        assert "PAT-BOB" in patient_ids, "Bob should be assigned to Dr. John Smith"
        assert "PAT-CHARLIE" not in patient_ids, "Charlie should NOT be assigned to Dr. John Smith"

        # 2. Patient Alice Isolation
        res = await client.post("/api/v1/auth/patient/login", json={
            "email": "alice@healthflow.ai",
            "password": "patient123"
        })
        assert res.status_code == 200, f"Patient login failed: {res.text}"
        data = res.json()
        token = data["access_token"]
        assert data["role"] == "Patient"
        assert data["user"]["patient_id"] == "PAT-ALICE"

        headers = {"Authorization": f"Bearer {token}"}
        dash_res = await client.get("/api/v1/patient/dashboard", headers=headers)
        assert dash_res.status_code == 200, f"Patient dashboard failed: {dash_res.text}"
        profile = dash_res.json().get("profile", {})
        print("2. Alice profile isolated:", profile.get("name"), profile.get("patient_id"))
        assert profile.get("patient_id") == "PAT-ALICE"
        assert profile.get("name") == "Alice Johnson"

        # 3. Patient Charlie Isolation
        res = await client.post("/api/v1/auth/patient/login", json={
            "email": "charlie@healthflow.ai",
            "password": "patient123"
        })
        assert res.status_code == 200, f"Patient login failed: {res.text}"
        data = res.json()
        token = data["access_token"]
        assert data["role"] == "Patient"
        assert data["user"]["patient_id"] == "PAT-CHARLIE"

        headers = {"Authorization": f"Bearer {token}"}
        dash_res = await client.get("/api/v1/patient/dashboard", headers=headers)
        assert dash_res.status_code == 200, f"Patient dashboard failed: {dash_res.text}"
        profile = dash_res.json().get("profile", {})
        print("3. Charlie profile isolated:", profile.get("name"), profile.get("patient_id"))
        assert profile.get("patient_id") == "PAT-CHARLIE"
        assert profile.get("name") == "Charlie Brown"

        # 4. Admin Full Access
        res = await client.post("/api/v1/auth/admin/login", json={
            "email": "admin@healthflow.ai",
            "password": "admin123"
        })
        assert res.status_code == 200
        token = res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        p_res = await client.get("/api/v1/entities/patients", headers=headers)
        assert p_res.status_code == 200
        all_patients = p_res.json()
        all_patient_ids = [p["patient_id"] for p in all_patients]

        print("4. Admin total patients fetched:", len(all_patient_ids))
        assert "PAT-ALICE" in all_patient_ids
        assert "PAT-BOB" in all_patient_ids
        assert "PAT-CHARLIE" in all_patient_ids

        print("SUCCESS: ALL RBAC DATA ISOLATION TESTS PASSED CLEANLY!")

if __name__ == "__main__":
    asyncio.run(run_rbac_tests())
