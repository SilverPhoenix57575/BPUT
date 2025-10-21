from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Content
from ..services.content_processor import ContentProcessor
from ..validators import validate_file_extension
from ..constants import ALLOWED_EXTENSIONS, MAX_FILE_SIZE
from ..logger import setup_logger
from datetime import datetime
import uuid
import os

logger = setup_logger(__name__)
router = APIRouter()
processor = ContentProcessor()

@router.post("/upload")
async def upload_content(
    file: UploadFile = File(...),
    user_id: str = "default_user",
    db: Session = Depends(get_db)
):
    try:
        logger.info(f"Uploading file: {file.filename} for user: {user_id}")
        
        file_ext = validate_file_extension(file.filename)
        
        file_content = await file.read()
        
        if len(file_content) > MAX_FILE_SIZE:
            logger.warning(f"File too large: {len(file_content)} bytes")
            raise HTTPException(status_code=400, detail=f"File too large. Max size: {MAX_FILE_SIZE // (1024*1024)}MB")
        
        if len(file_content) == 0:
            logger.warning("Empty file uploaded")
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        content_id = f"content_{uuid.uuid4().hex[:12]}"
        saved_filename = f"{content_id}{file_ext}"
        file_path = os.path.join("uploads", saved_filename)
        
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        logger.info(f"File saved: {file_path}")
        
        extracted_text = await processor.process_file(file.filename, file_content)
        logger.info(f"Text extracted: {len(extracted_text)} characters")
        
        content = Content(
            id=content_id,
            user_id=user_id,
            filename=file.filename,
            content_type=file.content_type,
            file_url=f"/uploads/{saved_filename}",
            extracted_text=extracted_text,
            created_at=datetime.utcnow()
        )
        
        db.add(content)
        db.commit()
        logger.info(f"Content saved to database: {content_id}")
        
        return {
            "success": True,
            "data": {
                "id": content_id,
                "filename": file.filename,
                "type": file.content_type,
                "extractedText": extracted_text[:500] if extracted_text else "No text extracted",
                "fileUrl": f"/uploads/{saved_filename}",
                "timestamp": content.created_at.isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to upload file. Please try again.")

@router.get("/list")
def list_content(user_id: str = "default_user", db: Session = Depends(get_db)):
    contents = db.query(Content).filter(Content.user_id == user_id).all()
    return {
        "success": True,
        "data": {
            "contents": [
                {
                    "id": c.id,
                    "filename": c.filename,
                    "type": c.content_type,
                    "fileUrl": c.file_url,
                    "timestamp": c.created_at.isoformat()
                }
                for c in contents
            ]
        }
    }

@router.get("/{content_id}")
def get_content(content_id: str, db: Session = Depends(get_db)):
    content = db.query(Content).filter(Content.id == content_id).first()
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    return {
        "success": True,
        "data": {
            "id": content.id,
            "filename": content.filename,
            "type": content.content_type,
            "fileUrl": content.file_url,
            "extractedText": content.extracted_text,
            "timestamp": content.created_at.isoformat()
        }
    }
