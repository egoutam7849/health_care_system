import os
import shutil
import pandas as pd
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.core.config import settings
from app.services.mapping_engine import HeaderMappingEngine
from app.database.models import ColumnMappingTemplate

router = APIRouter(prefix="/mapping", tags=["Column Mapping & Schema Inspection"])

@router.post("/inspect")
async def inspect_uploaded_schema(file: UploadFile = File(...), dataset_type: str = "patients"):
    if not file.filename.endswith((".csv", ".xlsx", ".xls", ".parquet", ".json")):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    temp_path = os.path.join(settings.BRONZE_DIR, f"temp_{file.filename}")
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(temp_path, nrows=50)
        elif file.filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(temp_path, nrows=50)
        elif file.filename.endswith(".parquet"):
            df = pd.read_parquet(temp_path).head(50)
        elif file.filename.endswith(".json"):
            df = pd.read_json(temp_path).head(50)

        inspection_res = HeaderMappingEngine.inspect_file(df, dataset_type)
        return inspection_res

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.get("/templates")
def get_mapping_templates(db: Session = Depends(get_db)):
    templates = db.query(ColumnMappingTemplate).all()
    return [{
        "id": t.id,
        "name": t.template_name,
        "dataset_type": t.dataset_type,
        "mapping": t.mapping_json
    } for t in templates]
