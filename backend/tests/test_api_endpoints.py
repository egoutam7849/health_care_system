import unittest
from fastapi import FastAPI
from app.database.database import engine, Base
from app.database.seed_data import seed_database
from main import app

class TestHealthcareAPIEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        seed_database()

    def test_app_initialization(self):
        self.assertIsNotNone(app)
        self.assertEqual(app.title, "HealthFlow AI")

    def test_seed_database(self):
        from app.database.database import SessionLocal
        from app.database.models import Patient, Hospital
        db = SessionLocal()
        p_count = db.query(Patient).count()
        h_count = db.query(Hospital).count()
        db.close()
        self.assertGreater(p_count, 0)
        self.assertGreater(h_count, 0)

if __name__ == "__main__":
    unittest.main()
