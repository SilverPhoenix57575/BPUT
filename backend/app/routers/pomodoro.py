from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import PomodoroSettings, PomodoroSession
from datetime import datetime, timedelta

router = APIRouter()

class PomodoroSettingsRequest(BaseModel):
    userId: str
    workDuration: int = 25
    shortBreak: int = 5
    longBreak: int = 15
    sessionsUntilLongBreak: int = 4
    autoStartBreaks: bool = False
    autoStartPomodoros: bool = False

class PomodoroSessionRequest(BaseModel):
    userId: str
    duration: int
    completed: bool = True

@router.get("/settings/{user_id}")
def get_settings(user_id: str, db: Session = Depends(get_db)):
    settings = db.query(PomodoroSettings).filter(PomodoroSettings.user_id == user_id).first()
    if not settings:
        settings = PomodoroSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return {
        "success": True,
        "data": {
            "workDuration": settings.work_duration,
            "shortBreak": settings.short_break,
            "longBreak": settings.long_break,
            "sessionsUntilLongBreak": settings.sessions_until_long_break,
            "autoStartBreaks": bool(settings.auto_start_breaks),
            "autoStartPomodoros": bool(settings.auto_start_pomodoros)
        }
    }

@router.post("/settings")
def save_settings(request: PomodoroSettingsRequest, db: Session = Depends(get_db)):
    settings = db.query(PomodoroSettings).filter(PomodoroSettings.user_id == request.userId).first()
    
    if settings:
        settings.work_duration = request.workDuration
        settings.short_break = request.shortBreak
        settings.long_break = request.longBreak
        settings.sessions_until_long_break = request.sessionsUntilLongBreak
        settings.auto_start_breaks = int(request.autoStartBreaks)
        settings.auto_start_pomodoros = int(request.autoStartPomodoros)
        settings.updated_at = datetime.utcnow()
    else:
        settings = PomodoroSettings(
            user_id=request.userId,
            work_duration=request.workDuration,
            short_break=request.shortBreak,
            long_break=request.longBreak,
            sessions_until_long_break=request.sessionsUntilLongBreak,
            auto_start_breaks=int(request.autoStartBreaks),
            auto_start_pomodoros=int(request.autoStartPomodoros)
        )
        db.add(settings)
    
    db.commit()
    return {"success": True, "message": "Settings saved"}

@router.post("/session")
def save_session(request: PomodoroSessionRequest, db: Session = Depends(get_db)):
    session = PomodoroSession(
        user_id=request.userId,
        duration=request.duration,
        completed=int(request.completed)
    )
    db.add(session)
    db.commit()
    return {"success": True, "message": "Session saved"}

@router.get("/stats/{user_id}")
def get_stats(user_id: str, db: Session = Depends(get_db)):
    today = datetime.utcnow().date()
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    today_sessions = db.query(PomodoroSession).filter(
        PomodoroSession.user_id == user_id,
        PomodoroSession.created_at >= datetime.combine(today, datetime.min.time())
    ).all()
    
    week_sessions = db.query(PomodoroSession).filter(
        PomodoroSession.user_id == user_id,
        PomodoroSession.created_at >= week_ago
    ).all()
    
    return {
        "success": True,
        "data": {
            "todayCount": len([s for s in today_sessions if s.completed]),
            "todayMinutes": sum(s.duration for s in today_sessions if s.completed),
            "weekCount": len([s for s in week_sessions if s.completed]),
            "weekMinutes": sum(s.duration for s in week_sessions if s.completed)
        }
    }
