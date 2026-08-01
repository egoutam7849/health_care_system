import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.database import engine, Base
from app.database.seed_data import seed_database

# Import routers
from app.api.endpoints import (
    auth, dashboard, upload, medallion,
    entities, etl, airflow, quality, reports, settings as settings_router,
    lineage, monitoring, audit, ai_insights, mapping, incoming, portals
)

# Initialize database tables
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Full-stack Enterprise Healthcare Data Engineering Platform (Dedicated User Portals: Admin, Doctor, Patient, Analyst)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Frontend React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix="/api")
app.include_router(dashboard.router, prefix="")
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(medallion.router, prefix=settings.API_V1_STR)
app.include_router(entities.router, prefix=settings.API_V1_STR)
app.include_router(entities.router, prefix="/api")
app.include_router(entities.router, prefix="")
app.include_router(etl.router, prefix=settings.API_V1_STR)
app.include_router(airflow.router, prefix=settings.API_V1_STR)
app.include_router(quality.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(settings_router.router, prefix=settings.API_V1_STR)
app.include_router(lineage.router, prefix=settings.API_V1_STR)
app.include_router(monitoring.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(ai_insights.router, prefix=settings.API_V1_STR)
app.include_router(mapping.router, prefix=settings.API_V1_STR)
app.include_router(incoming.router, prefix=settings.API_V1_STR)
app.include_router(portals.router, prefix=settings.API_V1_STR)
app.include_router(portals.router, prefix="/api")
app.include_router(portals.router, prefix="")

@app.get("/")
def root():
    return {
        "status": "online",
        "platform": settings.PROJECT_NAME,
        "portals": ["/admin/login", "/doctor/login", "/patient/login", "/analyst/login"],
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
