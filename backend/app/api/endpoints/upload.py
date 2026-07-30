import os
import shutil
import pandas as pd
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.config import settings
from app.services.etl_engine import MedallionETLEngine
from app.database.models import BronzeFile

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/dataset")
async def upload_dataset(file: UploadFile = File(...), trigger_etl: bool = False, db: Session = Depends(get_db)):
    if not file.filename.endswith((".csv", ".xlsx", ".xls", ".parquet")):
        raise HTTPException(status_code=400, detail="Only CSV, Excel, or Parquet files are supported.")

    file_path = os.path.join(settings.BRONZE_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read preview & schema
    if file.filename.endswith(".csv"):
        df = pd.read_csv(file_path, nrows=50)
    elif file.filename.endswith((".xlsx", ".xls")):
        df = pd.read_excel(file_path, nrows=50)
    elif file.filename.endswith(".parquet"):
        df = pd.read_parquet(file_path)
        df = df.head(50)

    rows, cols = len(df), len(df.columns)
    preview_data = df.head(10).to_dict(orient="records")
    columns_list = list(df.columns)

    result = {
        "filename": file.filename,
        "rows": rows,
        "columns_count": cols,
        "columns": columns_list,
        "size_kb": round(os.path.getsize(file_path) / 1024.0, 2),
        "storage_path": file_path,
        "preview": preview_data
    }

    if trigger_etl:
        etl_engine = MedallionETLEngine(db)
        etl_result = etl_engine.process_dataset(file_path, file.filename)
        result["etl_result"] = etl_result

    return result

@router.get("/history")
def get_upload_history(db: Session = Depends(get_db)):
    uploads = db.query(BronzeFile).order_by(BronzeFile.id.desc()).all()
    return [{
        "id": u.id,
        "filename": u.filename,
        "format": u.file_format,
        "rows": u.row_count,
        "cols": u.column_count,
        "size_kb": u.file_size_kb,
        "upload_time": u.upload_time.strftime("%Y-%m-%d %H:%M:%S")
    } for u in uploads]
