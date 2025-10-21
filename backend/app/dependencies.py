from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
from .auth import verify_token

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    
    return payload
