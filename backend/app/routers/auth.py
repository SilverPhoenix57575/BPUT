from fastapi import APIRouter, HTTPException, Depends, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..models import User
from ..auth import hash_password, verify_password, create_access_token, verify_token
import uuid

router = APIRouter()

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
    hashed_password = hash_password(request.password)
    
    user = User(
        id=user_id,
        email=request.email,
        hashed_password=hashed_password,
        role=request.role
    )
    
    db.add(user)
    db.commit()
    
    token = create_access_token(data={"sub": user_id, "email": request.email, "role": request.role})
    
    return {
        "userId": user_id,
        "token": token,
        "role": request.role
    }

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": user.id, "email": user.email, "role": user.role})
    
    return {
        "userId": user.id,
        "token": token,
        "role": user.role
    }

@router.get("/me")
def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    user_id = payload.get("sub")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "userId": user.id,
        "email": user.email,
        "role": user.role
    }
