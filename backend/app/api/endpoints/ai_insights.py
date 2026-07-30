from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.ai_insights import AIInsightsEngine

router = APIRouter(prefix="/ai-insights", tags=["AI Intelligence Engine"])

@router.get("/summary")
def get_ai_insights(db: Session = Depends(get_db)):
    engine = AIInsightsEngine(db)
    return engine.generate_dashboard_insights()
