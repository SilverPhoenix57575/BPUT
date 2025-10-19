from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Content
from ..services.content_processor import ContentProcessor
from datetime import datetime
import uuid

router = APIRouter()
processor = ContentProcessor()

@router.post("/upload")
async def upload_content(
    file: UploadFile = File(...),
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    try:
        content_id = f"content_{uuid.uuid4().hex[:12]}"
        file_content = await file.read()
        
        extracted_text = await processor.process_file(file.filename, file_content)
        
        content = Content(
            id=content_id,
            user_id=user_id,
            filename=file.filename,
            content_type=file.content_type,
            extracted_text=extracted_text,
            created_at=datetime.utcnow()
        )
        
        db.add(content)
        db.commit()
        
        return {
            "id": content_id,
            "filename": file.filename,
            "type": file.content_type,
            "extractedText": extracted_text[:500],
            "timestamp": content.created_at.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list")
def list_content(user_id: str = "default_user", db: Session = Depends(get_db)):
    contents = db.query(Content).filter(Content.user_id == user_id).all()
    return {
        "contents": [
            {
                "id": c.id,
                "filename": c.filename,
                "type": c.content_type,
                "timestamp": c.created_at.isoformat()
            }
            for c in contents
        ]
    }

@router.get("/{content_id}")
def get_content(content_id: str, db: Session = Depends(get_db)):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return {
        "id": content.id,
        "filename": content.filename,
        "type": content.content_type,
        "extractedText": content.extracted_text,
        "timestamp": content.created_at.isoformat()
    }
