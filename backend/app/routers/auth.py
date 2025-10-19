from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import User
from passlib.context import CryptContext
import uuid

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SignupRequest(BaseModel):
    email: str
    password: str
    role: str = "student"

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    hashed_password = pwd_context.hash(request.password)
    
    user = User(
        id=user_id,
        email=request.email,
        hashed_password=hashed_password,
        role=request.role
    )
    
    db.add(user)
    db.commit()
    
    return {
        "userId": user_id,
        "token": f"jwt_token_{user_id}",
        "role": request.role
    }

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not pwd_context.verify(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "userId": user.id,
        "token": f"jwt_token_{user.id}",
        "role": user.role
    }

@router.get("/me")
def get_current_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "userId": user.id,
        "email": user.email,
        "role": user.role
    }
