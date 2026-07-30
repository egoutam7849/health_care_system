import random
from datetime import datetime
from sqlalchemy.orm import Session
from app.database.models import AirflowTaskRun, Notification

class AirflowEngine:
    def __init__(self, db: Session):
        self.db = db

    def trigger_dag(self, dag_id: str) -> dict:
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

        dags_map = {
            "healthcare_medallion_etl_dag": [
                "ingest_raw_bronze_task",
                "pyspark_silver_clean_task",
                "gold_business_aggregations_task",
                "data_quality_assertion_task",
                "refresh_warehouse_dashboard_task"
            ],
            "daily_data_quality_check_dag": [
                "schema_validation_rule_task",
                "null_and_duplicate_scan_task",
                "financial_boundary_check_task",
                "quality_score_compilation_task"
            ],
            "hospital_revenue_aggregation_dag": [
                "extract_billing_records_task",
                "group_by_hospital_city_task",
                "compute_monthly_rev_runrate_task",
                "export_gold_revenue_table_task"
            ]
        }

        tasks = dags_map.get(dag_id, ["task_1", "task_2", "task_3"])

        executed_tasks = []
        for task_id in tasks:
            duration = round(random.uniform(0.8, 5.2), 2)
            task_run = AirflowTaskRun(
                dag_id=dag_id,
                task_id=task_id,
                execution_date=now_str,
                state="success",
                duration_sec=duration,
                try_number=1,
                timestamp=datetime.utcnow()
            )
            self.db.add(task_run)
            executed_tasks.append({
                "task_id": task_id,
                "state": "success",
                "duration_sec": duration
            })

        self.db.add(Notification(
            title=f"Airflow DAG Executed: {dag_id}",
            message=f"All {len(executed_tasks)} tasks in DAG '{dag_id}' completed with state SUCCESS.",
            type="success"
        ))

        self.db.commit()

        return {
            "dag_id": dag_id,
            "status": "success",
            "execution_date": now_str,
            "tasks_executed": executed_tasks
        }
