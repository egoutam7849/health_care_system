from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import DataLineageRun

router = APIRouter(prefix="/lineage", tags=["Data Lineage"])

@router.get("/graph")
def get_lineage_graph(db: Session = Depends(get_db)):
    # Standard 6-node lineage graph specification
    graph_nodes = [
        {"id": "node-1", "label": "Dataset Upload", "type": "source", "layer": "Raw Feed"},
        {"id": "node-2", "label": "Bronze Storage", "type": "medallion", "layer": "data/bronze/patients_raw.parquet"},
        {"id": "node-3", "label": "PySpark Cleaning", "type": "engine", "layer": "Deduplication & Null Impute"},
        {"id": "node-4", "label": "Silver Storage", "type": "medallion", "layer": "data/silver/patients_clean.parquet"},
        {"id": "node-5", "label": "Gold Summary", "type": "medallion", "layer": "data/gold/hospital_summary.parquet"},
        {"id": "node-6", "label": "Star Schema Warehouse", "type": "warehouse", "layer": "FactAdmissions & FactRevenue"},
        {"id": "node-7", "label": "Executive Dashboard", "type": "analytics", "layer": "Real-Time Visualizations"}
    ]

    edges = [
        {"source": "node-1", "target": "node-2"},
        {"source": "node-2", "target": "node-3"},
        {"source": "node-3", "target": "node-4"},
        {"source": "node-4", "target": "node-5"},
        {"source": "node-5", "target": "node-6"},
        {"source": "node-6", "target": "node-7"}
    ]

    runs = db.query(DataLineageRun).order_by(DataLineageRun.id.desc()).limit(10).all()
    recent_traces = [{
        "id": r.id,
        "run_id": r.run_id,
        "dataset": r.dataset_name,
        "step": r.step,
        "records_in": r.records_in,
        "records_out": r.records_out,
        "duration_sec": r.duration_sec,
        "status": r.status,
        "user": r.user,
        "pipeline_version": r.pipeline_version,
        "timestamp": r.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    } for r in runs]

    return {
        "nodes": graph_nodes,
        "edges": edges,
        "recent_traces": recent_traces
    }
