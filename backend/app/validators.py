from fastapi import HTTPException
from typing import Optional
import re
from .constants import (
    MIN_PASSWORD_LENGTH, MAX_TEXT_LENGTH, MIN_QUESTION_LENGTH,
    MIN_ENHANCE_TEXT_LENGTH, MAX_ENHANCE_TEXT_LENGTH, ALLOWED_EXTENSIONS
)

def validate_email(email: str) -> str:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    return email.lower().strip()

def validate_password(password: str) -> str:
    """Validate password strength"""
    if len(password) < MIN_PASSWORD_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Password must be at least {MIN_PASSWORD_LENGTH} characters"
        )
    return password

def validate_text_length(text: str, min_len: int, max_len: int, field: str = "Text") -> str:
    """Validate text length"""
    text = text.strip()
    if len(text) < min_len:
        raise HTTPException(
            status_code=400,
            detail=f"{field} must be at least {min_len} characters"
        )
    if len(text) > max_len:
        raise HTTPException(
            status_code=400,
            detail=f"{field} must not exceed {max_len} characters"
        )
    return text

def validate_file_extension(filename: str) -> str:
    """Validate file extension"""
    import os
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type {ext} not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    return ext

def sanitize_input(text: str) -> str:
    """Sanitize user input to prevent injection attacks"""
    # Remove null bytes
    text = text.replace('\x00', '')
    # Strip leading/trailing whitespace
    text = text.strip()
    return text
