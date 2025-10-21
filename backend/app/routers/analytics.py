from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from ..database import get_db
from ..models import StudySession, Achievement, Progress
from datetime import datetime, timedelta

router = APIRouter()

class StudySessionRequest(BaseModel):
    userId: str
    activityType: str
    topic: str
    duration: int
    score: float = None

@router.post("/session")
def log_session(request: StudySessionRequest, db: Session = Depends(get_db)):
    session = StudySession(
        user_id=request.userId,
        activity_type=request.activityType,
        topic=request.topic,
        duration=request.duration,
        score=request.score
    )
    db.add(session)
    db.commit()
    return {"status": "logged"}

@router.get("/dashboard/{user_id}")
def get_dashboard(user_id: str, db: Session = Depends(get_db)):
    today = datetime.utcnow().date()
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    # Time spent today
    today_sessions = db.query(func.sum(StudySession.duration)).filter(
        StudySession.user_id == user_id,
        func.date(StudySession.created_at) == today
    ).scalar() or 0
    
    # Time spent this week
    week_sessions = db.query(func.sum(StudySession.duration)).filter(
        StudySession.user_id == user_id,
        StudySession.created_at >= week_ago
    ).scalar() or 0
    
    # Activity counts
    notes_count = db.query(func.count(StudySession.id)).filter(
        StudySession.user_id == user_id,
        StudySession.activity_type == 'note'
    ).scalar() or 0
    
    flashcards_count = db.query(func.count(StudySession.id)).filter(
        StudySession.user_id == user_id,
        StudySession.activity_type == 'flashcard'
    ).scalar() or 0
    
    quizzes_count = db.query(func.count(StudySession.id)).filter(
        StudySession.user_id == user_id,
        StudySession.activity_type == 'quiz'
    ).scalar() or 0
    
    return {
        "timeToday": today_sessions,
        "timeWeek": week_sessions,
        "notesCount": notes_count,
        "flashcardsCount": flashcards_count,
        "quizzesCount": quizzes_count
    }

@router.get("/parental/{user_id}")
def get_parental_analytics(user_id: str, db: Session = Depends(get_db)):
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    # Study activity summary
    notes = db.query(func.count(StudySession.id)).filter(
        StudySession.user_id == user_id,
        StudySession.activity_type == 'note'
    ).scalar() or 0
    
    flashcards = db.query(func.count(StudySession.id)).filter(
        StudySession.user_id == user_id,
        StudySession.activity_type == 'flashcard'
    ).scalar() or 0
    
    quizzes = db.query(func.count(StudySession.id)).filter(
        StudySession.user_id == user_id,
        StudySession.activity_type == 'quiz'
    ).scalar() or 0
    
    # Weekly study time (last 7 days)
    weekly_data = []
    for i in range(7):
        day = datetime.utcnow().date() - timedelta(days=6-i)
        duration = db.query(func.sum(StudySession.duration)).filter(
            StudySession.user_id == user_id,
            func.date(StudySession.created_at) == day
        ).scalar() or 0
        weekly_data.append({"day": day.strftime("%a"), "minutes": duration // 60})
    
    # Streak calculation
    sessions = db.query(StudySession).filter(
        StudySession.user_id == user_id
    ).order_by(StudySession.created_at.desc()).all()
    
    streak = 0
    if sessions:
        current_date = datetime.utcnow().date()
        dates = set(s.created_at.date() for s in sessions)
        while current_date in dates:
            streak += 1
            current_date -= timedelta(days=1)
    
    # Topic accuracy
    progress_records = db.query(Progress).filter(Progress.user_id == user_id).all()
    topic_accuracy = [
        {"topic": p.competency_id, "accuracy": round(p.mastery_level * 100, 1)}
        for p in progress_records[:5]
    ]
    
    # Achievements
    achievements = db.query(Achievement).filter(Achievement.user_id == user_id).all()
    badges = [{"name": a.badge_name, "earnedAt": a.earned_at.isoformat()} for a in achievements]
    
    return {
        "activitySummary": {
            "notes": notes,
            "flashcards": flashcards,
            "quizzes": quizzes
        },
        "weeklyStudyTime": weekly_data,
        "streak": streak,
        "topicAccuracy": topic_accuracy,
        "achievements": badges
    }

@router.post("/achievement")
def award_achievement(user_id: str, badge_id: str, badge_name: str, db: Session = Depends(get_db)):
    existing = db.query(Achievement).filter(
        Achievement.user_id == user_id,
        Achievement.badge_id == badge_id
    ).first()
    
    if not existing:
        achievement = Achievement(
            user_id=user_id,
            badge_id=badge_id,
            badge_name=badge_name
        )
        db.add(achievement)
        db.commit()
        return {"status": "awarded"}
    return {"status": "already_earned"}
