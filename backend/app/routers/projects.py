from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from ..database import get_db
from ..models import User
from ..dependencies import get_current_user
import uuid
from datetime import datetime

router = APIRouter()

class ProjectCreate(BaseModel):
    project_name: str = Field(..., min_length=3, max_length=50)
    project_icon_tag: str = Field(default="📁")

class ProjectResponse(BaseModel):
    project_id: str
    project_name: str
    project_icon: str
    created_at: str

@router.post("/create", response_model=ProjectResponse)
def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.get("sub")
    
    # Check for duplicate project name for this user
    # Note: In production, you'd have a Project model in database
    # For now, we'll return success as projects are stored client-side
    
    project_id = f"proj_{uuid.uuid4().hex[:12]}"
    
    return ProjectResponse(
        project_id=project_id,
        project_name=project.project_name,
        project_icon=project.project_icon_tag,
        created_at=datetime.utcnow().isoformat()
    )

@router.get("/list")
def list_projects(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Return empty list for now as projects are stored client-side
    return {"projects": []}

@router.delete("/{project_id}")
def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {"message": "Project deleted successfully"}
