from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Progress
from ..services.career_mapper import CareerMapper

router = APIRouter()
career_mapper = CareerMapper()

@router.get("/recommendations")
def get_recommendations(user_id: str, db: Session = Depends(get_db)):
    progress_records = db.query(Progress).filter(Progress.user_id == user_id).all()
    mastered = [p.competency_id for p in progress_records if p.mastery_level > 0.95]
    
    recommendations = career_mapper.get_career_recommendations(mastered)
    
    return {"recommendations": recommendations}

@router.get("/skills-gap")
def get_skills_gap(user_id: str, career: str, db: Session = Depends(get_db)):
    progress_records = db.query(Progress).filter(Progress.user_id == user_id).all()
    mastered = [p.competency_id for p in progress_records if p.mastery_level > 0.95]
    
    gap = career_mapper.get_skills_gap(career, mastered)
    
    return {"skillsGap": gap}

@router.get("/jobs")
def get_jobs(skills: str = ""):
    jobs = career_mapper.get_job_listings(skills.split(",") if skills else [])
    return {"jobs": jobs}
