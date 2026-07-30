import os
import hashlib
import uuid
import shutil
from datetime import datetime
from sqlalchemy.orm import Session
from app.services.dataset_classifier import DatasetClassifier
from app.services.etl_engine import MedallionETLEngine
from app.database.models import BatchIngestionMetadata, Notification, AuditLog

class IncomingFileWatcherService:
    def __init__(self, db: Session):
        self.db = db
        self.incoming_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "incoming"))
        os.makedirs(self.incoming_dir, exist_ok=True)

    def compute_md5(self, file_path: str) -> str:
        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()

    def scan_and_process_incoming_files(self) -> list:
        if not os.path.exists(self.incoming_dir):
            return []

        files = [f for f in os.listdir(self.incoming_dir) if f.endswith((".csv", ".xlsx", ".xls", ".parquet", ".json"))]
        results = []

        etl_engine = MedallionETLEngine(self.db)

        for filename in files:
            file_path = os.path.join(self.incoming_dir, filename)
            checksum = self.compute_md5(file_path)

            # Check if this exact checksum was processed recently
            existing = self.db.query(BatchIngestionMetadata).filter(BatchIngestionMetadata.checksum_md5 == checksum).first()
            if existing:
                continue

            run_id = f"RUN-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{uuid.uuid4().hex[:4].upper()}"
            start_time = datetime.utcnow()

            batch_meta = BatchIngestionMetadata(
                run_id=run_id,
                dataset_name=filename,
                source_hospital="Metro General Hospital" if "metro" in filename.lower() else "Johns Hopkins Medical Center",
                checksum_md5=checksum,
                schema_version="v1.0-pyspark",
                status="PROCESSING",
                started_at=start_time
            )
            self.db.add(batch_meta)
            self.db.commit()

            try:
                etl_res = etl_engine.process_dataset(file_path, filename)
                
                batch_meta.status = "COMPLETED"
                batch_meta.records_total = etl_res.get("records_processed", 0) + etl_res.get("invalid_records_dropped", 0)
                batch_meta.records_valid = etl_res.get("records_processed", 0)
                batch_meta.records_quarantined = etl_res.get("invalid_records_dropped", 0)
                batch_meta.completed_at = datetime.utcnow()

                self.db.add(Notification(
                    title=f"Automated Batch Ingested: {filename}",
                    message=f"Batch {run_id} processed {batch_meta.records_valid} valid records. Medallion & Star Schema refreshed.",
                    type="success"
                ))

                self.db.add(AuditLog(
                    user_email="system@healthflow.ai",
                    action="Automated Directory Watcher Ingestion",
                    details=f"Processed incoming file drop '{filename}' with checksum {checksum[:8]}...",
                    status="SUCCESS"
                ))

                self.db.commit()
                results.append({
                    "filename": filename,
                    "run_id": run_id,
                    "status": "COMPLETED",
                    "valid_records": batch_meta.records_valid,
                    "quarantined_records": batch_meta.records_quarantined
                })

            except Exception as e:
                batch_meta.status = "FAILED"
                self.db.commit()
                results.append({
                    "filename": filename,
                    "run_id": run_id,
                    "status": "FAILED",
                    "error": str(e)
                })

        return results
