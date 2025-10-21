from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime

# Standard API Response wrapper
class APIResponse(BaseModel):
    success: bool = True
    data: Optional[Any] = None
    message: Optional[str] = None
    error: Optional[str] = None
    timestamp: str = datetime.utcnow().isoformat()

class PaginatedResponse(BaseModel):
    success: bool = True
    data: List[Any]
    total: int
    page: int
    pageSize: int
    timestamp: str = datetime.utcnow().isoformat()

# Helper functions
def success_response(data: Any, message: Optional[str] = None):
    return {
        "success": True,
        "data": data,
        "message": message,
        "timestamp": datetime.utcnow().isoformat()
    }

def error_response(error: str, status_code: int = 400):
    return {
        "success": False,
        "error": error,
        "timestamp": datetime.utcnow().isoformat()
    }
