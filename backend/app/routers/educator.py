from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Progress
from ..services.analytics import AnalyticsService

router = APIRouter()
analytics = AnalyticsService()

@router.get("/students")
def get_students(educator_id: str, db: Session = Depends(get_db)):
    students = db.query(User).filter(User.role == "student").all()
    
    return {
        "students": [
            {
                "id": s.id,
                "name": s.email.split("@")[0],
                "email": s.email,
                "overallProgress": 0.65
            }
            for s in students
        ]
    }

@router.get("/analytics/{student_id}")
def get_analytics(student_id: str, db: Session = Depends(get_db)):
    progress_records = db.query(Progress).filter(Progress.user_id == student_id).all()
    
    competency_progress = {}
    for record in progress_records:
        competency_progress[record.competency_id] = record.mastery_level
    
    return {
        "studentId": student_id,
        "competencyProgress": competency_progress,
        "timeSpent": 3600,
        "quizzesCompleted": len(progress_records),
        "averageScore": sum(competency_progress.values()) / len(competency_progress) if competency_progress else 0
    }

@router.post("/assign-content")
def assign_content(student_id: str, content_id: str, db: Session = Depends(get_db)):
    return {
        "success": True,
        "message": f"Content {content_id} assigned to {student_id}"
    }

@router.get("/export-report")
def export_report(student_id: str, db: Session = Depends(get_db)):
    return {
        "reportUrl": f"/reports/{student_id}.pdf",
        "generatedAt": "2024-01-15T10:30:00Z"
    }
