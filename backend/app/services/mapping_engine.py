import pandas as pd
from typing import Dict, List, Any

# Canonical System Schemas for Healthcare Entities
CANONICAL_SCHEMAS = {
    "patients": {
        "patient_id": ["patient_id", "patientid", "pid", "patient_no", "id", "pat_id"],
        "name": ["name", "patient_name", "patientname", "full_name", "pt_name"],
        "age": ["age", "patient_age", "years"],
        "gender": ["gender", "sex"],
        "disease": ["disease", "diagnosis", "condition", "illness", "disease_name"],
        "hospital_name": ["hospital_name", "hospital", "facility", "hospitalname", "center"],
        "doctor_name": ["doctor_name", "doctor", "physician", "doctorname", "dr_name"],
        "admission_date": ["admission_date", "adm_date", "admitted_on", "admission"],
        "discharge_date": ["discharge_date", "dis_date", "discharged_on", "discharge"],
        "bill_amount": ["bill_amount", "bill", "cost", "total_charge", "amount", "charge"],
        "city": ["city", "location", "address", "town"]
    },
    "doctors": {
        "doc_id": ["doc_id", "doctor_id", "doctorid", "did"],
        "name": ["name", "doctor_name", "physician_name"],
        "specialization": ["specialization", "specialty", "department"],
        "hospital_name": ["hospital_name", "hospital", "facility"],
        "experience_years": ["experience_years", "experience", "exp"],
        "success_rate": ["success_rate", "rating", "score"],
        "email": ["email", "doctor_email"],
        "phone": ["phone", "contact", "mobile"]
    },
    "hospitals": {
        "hospital_id": ["hospital_id", "hid", "facility_id"],
        "name": ["name", "hospital_name", "facility_name"],
        "city": ["city", "location"],
        "total_beds": ["total_beds", "beds", "capacity"],
        "occupied_beds": ["occupied_beds", "occupied", "occupancy"],
        "total_revenue": ["total_revenue", "revenue"],
        "rating": ["rating", "score"]
    }
}

class HeaderMappingEngine:
    @staticmethod
    def inspect_file(df: pd.DataFrame, dataset_type: str = "patients") -> Dict[str, Any]:
        raw_headers = list(df.columns)
        canonical_map = CANONICAL_SCHEMAS.get(dataset_type, CANONICAL_SCHEMAS["patients"])
        
        suggested_mapping = {}
        for header in raw_headers:
            clean_hdr = header.strip().lower().replace(" ", "_").replace("-", "_")
            matched = False
            for field, aliases in canonical_map.items():
                if clean_hdr in aliases:
                    suggested_mapping[header] = field
                    matched = True
                    break
            if not matched:
                suggested_mapping[header] = clean_hdr  # Preserve extra/custom columns gracefully!

        data_types = {col: str(dtype) for col, dtype in df.dtypes.items()}
        null_counts = {col: int(df[col].isnull().sum()) for col in df.columns}
        preview = df.head(5).to_dict(orient="records")

        return {
            "raw_headers": raw_headers,
            "data_types": data_types,
            "null_counts": null_counts,
            "suggested_mapping": suggested_mapping,
            "canonical_fields": list(canonical_map.keys()),
            "preview": preview,
            "total_rows": len(df),
            "total_columns": len(raw_headers)
        }

    @staticmethod
    def apply_mapping(df: pd.DataFrame, mapping: Dict[str, str]) -> pd.DataFrame:
        # Rename mapped columns
        rename_dict = {k: v for k, v in mapping.items() if k in df.columns and v}
        df_mapped = df.rename(columns=rename_dict)
        return df_mapped
