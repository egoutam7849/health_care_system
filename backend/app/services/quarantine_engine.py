import os
import json
from datetime import datetime
import pandas as pd
from sqlalchemy.orm import Session
from app.database.models import QuarantineRecord

class DataQuarantineEngine:
    def __init__(self, db: Session):
        self.db = db
        self.quarantine_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "quarantine"))
        os.makedirs(self.quarantine_dir, exist_ok=True)

    def evaluate_and_quarantine(self, df: pd.DataFrame, run_id: str, dataset_name: str) -> (pd.DataFrame, pd.DataFrame):
        invalid_mask = pd.Series(False, index=df.index)
        quarantine_reasons = pd.Series("", index=df.index)

        # Rule 1: Missing patient ID / Name
        if "patient_id" in df.columns:
            null_id = df["patient_id"].isnull() | (df["patient_id"] == "")
            invalid_mask = invalid_mask | null_id
            quarantine_reasons.loc[null_id] += "Missing Patient ID; "

        # Rule 2: Negative Bill Amount
        if "bill_amount" in df.columns:
            df["bill_amount_numeric"] = pd.to_numeric(df["bill_amount"], errors='coerce')
            neg_bill = df["bill_amount_numeric"] < 0
            invalid_mask = invalid_mask | neg_bill
            quarantine_reasons.loc[neg_bill] += "Negative Bill Amount (< $0); "
            df.drop(columns=["bill_amount_numeric"], errors='ignore', inplace=True)

        # Rule 3: Invalid Human Age Range (0-120)
        if "age" in df.columns:
            df["age_numeric"] = pd.to_numeric(df["age"], errors='coerce')
            invalid_age = (df["age_numeric"] < 0) | (df["age_numeric"] > 120)
            invalid_mask = invalid_mask | invalid_age
            quarantine_reasons.loc[invalid_age] += "Invalid Human Age Range; "
            df.drop(columns=["age_numeric"], errors='ignore', inplace=True)

        df_valid = df[~invalid_mask].copy()
        df_invalid = df[invalid_mask].copy()
        df_invalid["quarantine_reason"] = quarantine_reasons[invalid_mask]

        if not df_invalid.empty:
            # Write invalid rows to data/quarantine/
            quarantine_parquet = os.path.join(self.quarantine_dir, f"quarantine_{run_id}.parquet")
            df_invalid.to_parquet(quarantine_parquet, index=False)

            # Insert into QuarantineRecord DB table
            quarantine_entries = []
            for _, row in df_invalid.iterrows():
                row_dict = row.to_dict()
                reason = str(row_dict.pop("quarantine_reason", "Data quality contract violation"))
                entry = QuarantineRecord(
                    run_id=run_id,
                    dataset_name=dataset_name,
                    raw_record_json=json.dumps(row_dict, default=str),
                    quarantine_reason=reason,
                    quarantined_at=datetime.utcnow()
                )
                quarantine_entries.append(entry)

            self.db.add_all(quarantine_entries)
            self.db.commit()

        return df_valid, df_invalid
