from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import BatchIngestionMetadata, QuarantineRecord
from app.services.incoming_watcher import IncomingFileWatcherService

router = APIRouter(prefix="/incoming", tags=["Incoming Batch Watcher & Quarantine"])

@router.post("/scan")
def trigger_incoming_directory_scan(db: Session = Depends(get_db)):
    watcher = IncomingFileWatcherService(db)
    results = watcher.scan_and_process_incoming_files()
    return {
        "status": "success",
        "scanned_files_count": len(results),
        "results": results
    }

@router.get("/batches")
def get_batch_ingestion_history(db: Session = Depends(get_db)):
    batches = db.query(BatchIngestionMetadata).order_by(BatchIngestionMetadata.id.desc()).all()
    if not batches:
        watcher = IncomingFileWatcherService(db)
        watcher.scan_and_process_incoming_files()
        batches = db.query(BatchIngestionMetadata).order_by(BatchIngestionMetadata.id.desc()).all()

    return [{
        "id": b.id,
        "run_id": b.run_id,
        "dataset_name": b.dataset_name,
        "source_hospital": b.source_hospital,
        "checksum_md5": b.checksum_md5,
        "schema_version": b.schema_version,
        "status": b.status,
        "records_total": b.records_total,
        "records_valid": b.records_valid,
        "records_quarantined": b.records_quarantined,
        "started_at": b.started_at.strftime("%Y-%m-%d %H:%M:%S")
    } for b in batches]

@router.get("/quarantine")
def get_quarantined_records(db: Session = Depends(get_db)):
    records = db.query(QuarantineRecord).order_by(QuarantineRecord.id.desc()).limit(50).all()
    return [{
        "id": q.id,
        "run_id": q.run_id,
        "dataset_name": q.dataset_name,
        "raw_record": q.raw_record_json,
        "reason": q.quarantine_reason,
        "quarantined_at": q.quarantined_at.strftime("%Y-%m-%d %H:%M:%S")
    } for q in records]
