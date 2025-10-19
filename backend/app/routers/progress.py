from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import Progress
from ..services.bkt_service import BKTService
from datetime import datetime

router = APIRouter()
bkt_service = BKTService()

class ProgressRequest(BaseModel):
    userId: str
    competencyId: str
    interactions: list

@router.post("/save")
def save_progress(request: ProgressRequest, db: Session = Depends(get_db)):
    mastery_level = bkt_service.get_mastery_level(request.interactions)
    
    existing = db.query(Progress).filter(
        Progress.user_id == request.userId,
        Progress.competency_id == request.competencyId
    ).first()
    
    if existing:
        existing.mastery_level = mastery_level
        existing.interactions = request.interactions
        existing.updated_at = datetime.utcnow()
    else:
        progress = Progress(
            user_id=request.userId,
            competency_id=request.competencyId,
            mastery_level=mastery_level,
            interactions=request.interactions
        )
        db.add(progress)
    
    db.commit()
    
    return {
        "masteryLevel": mastery_level,
        "nextRecommendation": "cs_002"
    }

@router.get("/{user_id}")
def get_progress(user_id: str, db: Session = Depends(get_db)):
    progress_records = db.query(Progress).filter(Progress.user_id == user_id).all()
    
    mastery_levels = {p.competency_id: p.mastery_level for p in progress_records}
    badges = [p.competency_id for p in progress_records if p.mastery_level > 0.95]
    
    return {
        "userId": user_id,
        "masteryLevels": mastery_levels,
        "totalInteractions": sum(len(p.interactions or []) for p in progress_records),
        "badges": badges
    }

@router.get("/competency/{competency_id}")
def get_competency_progress(competency_id: str, db: Session = Depends(get_db)):
    progress_records = db.query(Progress).filter(Progress.competency_id == competency_id).all()
    
    return {
        "competencyId": competency_id,
        "totalStudents": len(progress_records),
        "averageMastery": sum(p.mastery_level for p in progress_records) / len(progress_records) if progress_records else 0
    }
