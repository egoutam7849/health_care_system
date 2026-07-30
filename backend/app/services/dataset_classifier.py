import pandas as pd

class DatasetClassifier:
    @staticmethod
    def classify_dataset(df: pd.DataFrame) -> str:
        headers = [h.strip().lower().replace(" ", "_") for h in df.columns]
        
        # Check signature matches
        if any(h in headers for h in ["patient_id", "pid", "disease", "diagnosis", "bill_amount", "admission_date"]):
            return "patients"
        elif any(h in headers for h in ["doc_id", "doctor_id", "specialization", "specialty", "experience_years"]):
            return "doctors"
        elif any(h in headers for h in ["hospital_id", "hid", "total_beds", "occupied_beds"]):
            return "hospitals"
        elif any(h in headers for h in ["appointment_id", "apt_id", "time_slot"]):
            return "appointments"
        else:
            return "patients"
