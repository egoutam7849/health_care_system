from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import AirflowTaskRun
from app.services.airflow_engine import AirflowEngine

router = APIRouter(prefix="/airflow", tags=["Apache Airflow DAGs"])

@router.get("/dags")
def get_airflow_dags(db: Session = Depends(get_db)):
    # Return DAG definitions & execution stats
    dags = [
        {
            "dag_id": "healthcare_medallion_etl_dag",
            "schedule": "0 0 * * *",
            "description": "Orchestrates Bronze -> Silver PySpark -> Gold Warehouse loading.",
            "status": "active",
            "tasks_count": 5,
            "last_run_state": "success"
        },
        {
            "dag_id": "daily_data_quality_check_dag",
            "schedule": "0 6 * * *",
            "description": "Performs null scans, schema validations, and metric scoring.",
            "status": "active",
            "tasks_count": 4,
            "last_run_state": "success"
        },
        {
            "dag_id": "hospital_revenue_aggregation_dag",
            "schedule": "0 23 * * *",
            "description": "Aggregates daily billing and exports Gold revenue reports.",
            "status": "active",
            "tasks_count": 4,
            "last_run_state": "success"
        }
    ]
    return dags

@router.post("/trigger/{dag_id}")
def trigger_dag(dag_id: str, db: Session = Depends(get_db)):
    engine = AirflowEngine(db)
    result = engine.trigger_dag(dag_id)
    return result

@router.get("/runs")
def get_airflow_task_runs(db: Session = Depends(get_db)):
    runs = db.query(AirflowTaskRun).order_by(AirflowTaskRun.id.desc()).limit(20).all()
    return [{
        "id": r.id,
        "dag_id": r.dag_id,
        "task_id": r.task_id,
        "execution_date": r.execution_date,
        "state": r.state,
        "duration_sec": r.duration_sec
    } for r in runs]
