from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from ..database import get_db
from ..models import MindMap
from ..services.ai_service import AIService
from datetime import datetime
import uuid
import json
import re

router = APIRouter()
ai_service = AIService()

class MindMapRequest(BaseModel):
    userId: str
    title: str
    data: Dict[str, Any]

class GenerateMindMapRequest(BaseModel):
    topic: str
    userId: str

@router.post("/generate")
async def generate_mindmap(request: GenerateMindMapRequest, db: Session = Depends(get_db)):
    try:
        prompt = f"""Create a mind map structure for the topic: "{request.topic}"

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{{
  "central": "{request.topic}",
  "branches": [
    {{
      "id": "1",
      "label": "Main Concept 1",
      "children": [
        {{"id": "1.1", "label": "Sub-concept 1.1"}},
        {{"id": "1.2", "label": "Sub-concept 1.2"}}
      ]
    }},
    {{
      "id": "2",
      "label": "Main Concept 2",
      "children": [
        {{"id": "2.1", "label": "Sub-concept 2.1"}}
      ]
    }}
  ]
}}

Create 4-6 main branches with 2-4 children each. Keep labels concise (2-5 words)."""

        import asyncio
        from functools import partial
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(None, partial(ai_service.model.generate_content, prompt))
        response_text = response.text
        
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            mindmap_data = json.loads(json_match.group())
        else:
            mindmap_data = json.loads(response_text)
        
        mindmap_id = str(uuid.uuid4())
        mindmap = MindMap(
            id=mindmap_id,
            user_id=request.userId,
            title=request.topic,
            data=mindmap_data
        )
        db.add(mindmap)
        db.commit()
        
        return {
            "success": True,
            "data": {
                "id": mindmap_id,
                "title": request.topic,
                "data": mindmap_data
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.get("/list/{user_id}")
def list_mindmaps(user_id: str, db: Session = Depends(get_db)):
    mindmaps = db.query(MindMap).filter(MindMap.user_id == user_id).order_by(MindMap.updated_at.desc()).all()
    return {
        "success": True,
        "data": [{"id": m.id, "title": m.title, "createdAt": m.created_at.isoformat()} for m in mindmaps]
    }

@router.get("/{mindmap_id}")
def get_mindmap(mindmap_id: str, db: Session = Depends(get_db)):
    mindmap = db.query(MindMap).filter(MindMap.id == mindmap_id).first()
    if not mindmap:
        raise HTTPException(status_code=404, detail="Mind map not found")
    
    return {
        "success": True,
        "data": {
            "id": mindmap.id,
            "title": mindmap.title,
            "data": mindmap.data,
            "createdAt": mindmap.created_at.isoformat()
        }
    }

@router.put("/{mindmap_id}")
def update_mindmap(mindmap_id: str, request: MindMapRequest, db: Session = Depends(get_db)):
    mindmap = db.query(MindMap).filter(MindMap.id == mindmap_id).first()
    if not mindmap:
        raise HTTPException(status_code=404, detail="Mind map not found")
    
    mindmap.title = request.title
    mindmap.data = request.data
    mindmap.updated_at = datetime.utcnow()
    db.commit()
    
    return {"success": True, "message": "Mind map updated"}

@router.delete("/{mindmap_id}")
def delete_mindmap(mindmap_id: str, db: Session = Depends(get_db)):
    mindmap = db.query(MindMap).filter(MindMap.id == mindmap_id).first()
    if not mindmap:
        raise HTTPException(status_code=404, detail="Mind map not found")
    
    db.delete(mindmap)
    db.commit()
    return {"success": True, "message": "Mind map deleted"}
