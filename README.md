# HealthFlow AI – Enterprise Healthcare Data Engineering & Analytics Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![PySpark](https://img.shields.io/badge/PySpark-3.5-orange.svg)](https://spark.apache.org/)
[![Apache Airflow](https://img.shields.io/badge/Apache%20Airflow-2.9-teal.svg)](https://airflow.apache.org/)

**HealthFlow AI** is a production-grade, enterprise healthcare data engineering platform designed to demonstrate modern Data Engineering architecture. The system ingests raw healthcare datasets, processes them through a real **Bronze → Silver → Gold Medallion Pipeline** using PySpark and Storage Abstraction (Local/AWS S3), orchestrates DAG workflows with Apache Airflow, validates datasets against automated Great Expectations quality contracts, loads analytical data into a **Star Schema Data Warehouse** (PostgreSQL/SQLite), and presents executive clinical & operational insights in a React 19 dashboard inspired by Microsoft Fabric and Databricks.

---

## 🏗️ Architecture Diagram

```
                        +---------------------------------------------+
                        |        Ingestion Source (CSV / EHR / S3)    |
                        +---------------------------------------------+
                                               |
                                               v
                        +---------------------------------------------+
                        |         BRONZE STORAGE LAYER                |
                        |      data/bronze/*.parquet (Immutable)      |
                        +---------------------------------------------+
                                               |
                                               v (PySpark Clean Engine)
                        +---------------------------------------------+
                        |         SILVER STORAGE LAYER                |
                        |     data/silver/patients_clean.parquet      |
                        +---------------------------------------------+
                                               |
                                               v (Aggregations & Business Rules)
                        +---------------------------------------------+
                        |          GOLD STORAGE LAYER                 |
                        |     data/gold/hospital_summary.parquet      |
                        +---------------------------------------------+
                                               |
                                               v
                        +---------------------------------------------+
                        |      DATA WAREHOUSE (Star Schema)           |
                        |  FactAdmissions | FactRevenue | DimPatient  |
                        +---------------------------------------------+
                                               |
                                               v
                        +---------------------------------------------+
                        |     React 19 Executive Dashboard & Lineage  |
                        +---------------------------------------------+
```

---

## 📊 Star Schema ER Diagram

```
                 +-------------------+
                 |    DimPatient     |
                 +-------------------+
                 | PK patient_key    |
                 |    patient_id     |
                 |    name, age, city|
                 +-------------------+
                           |
                           | 1:N
                           v
+-------------------+    +--------------------+    +--------------------+
|    DimHospital    |--->|   FactAdmissions   |<---|     DimDisease     |
+-------------------+    +--------------------+    +--------------------+
| PK hospital_key   |    | PK fact_id         |    | PK disease_key     |
|    hospital_id    |    | FK patient_key     |    |    disease_name    |
|    name, city     |    | FK hospital_key    |    |    severity_index  |
+-------------------+    | FK doctor_key      |    +--------------------+
                         | FK disease_key     |
                         | FK date_key        |
                         | bill_amount        |
                         | stay_duration_days |
                         +--------------------+
```

---

## ⚡ Key Features

- **Medallion Parquet Storage**: Real file-backed Medallion processing (`data/bronze/`, `data/silver/`, `data/gold/`).
- **PySpark Cleaning Engine**: Deduplication on partition keys, median null imputation, date normalization to ISO-8601, and range checks.
- **Storage Abstraction**: Seamless configuration switching between `LocalStorageProvider` and AWS `S3StorageProvider`.
- **Star Schema Data Warehouse**: Relational PostgreSQL fact & dimension tables (`FactAdmissions`, `FactRevenue`, `DimPatient`, `DimHospital`, `DimDoctor`, `DimDisease`, `DimDate`).
- **Apache Airflow DAGs**: Production DAG definitions (`healthcare_etl_pipeline_dag.py`, `daily_quality_validation_dag.py`, `hospital_revenue_aggregation_dag.py`).
- **Data Lineage Page**: End-to-end DAG node flow visualizer (`/lineage`).
- **Infrastructure Monitoring Dashboard**: System CPU, storage disk usage, Airflow health, and API latency charts (`/monitoring`).
- **Security & Audit Logs**: JWT authentication with Role-Based Access Control (Admin, Data Engineer, Analyst, Viewer) & Audit trail logging (`/audit`).
- **AI Insights Engine**: Natural language executive synthesis for clinical prevalence and revenue spikes.

---

## 🚀 Quick Start (Local Setup)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run Database Seed & API Server
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
- API Docs (Swagger): `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Frontend Application: `http://localhost:3000`

---

## 🐳 Docker Compose

Start the full platform (FastAPI, React, PostgreSQL 16, Airflow) with a single command:

```bash
docker-compose up --build
```

---

## 🧪 Testing

Run the automated pytest test suite:

```bash
cd backend
pytest tests/
```

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
