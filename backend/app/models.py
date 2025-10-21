from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class Content(Base):
    __tablename__ = "contents"
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    filename = Column(String)
    content_type = Column(String, index=True)
    file_url = Column(String)
    extracted_text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class Progress(Base):
    __tablename__ = "progress"
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    competency_id = Column(String, index=True)
    mastery_level = Column(Float, default=0.1)
    interactions = Column(JSON)
    updated_at = Column(DateTime, default=datetime.utcnow, index=True)

class StudySession(Base):
    __tablename__ = "study_sessions"
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    activity_type = Column(String, index=True)
    topic = Column(String, index=True)
    duration = Column(Integer)
    score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

class Achievement(Base):
    __tablename__ = "achievements"
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    badge_id = Column(String, index=True)
    badge_name = Column(String)
    earned_at = Column(DateTime, default=datetime.utcnow, index=True)
