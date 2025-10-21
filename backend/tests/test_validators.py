import pytest
from fastapi import HTTPException
from app.validators import (
    validate_email, validate_password, validate_text_length,
    validate_file_extension, sanitize_input
)

def test_validate_email_valid():
    assert validate_email("test@example.com") == "test@example.com"
    assert validate_email("USER@EXAMPLE.COM") == "user@example.com"

def test_validate_email_invalid():
    with pytest.raises(HTTPException):
        validate_email("invalid-email")
    with pytest.raises(HTTPException):
        validate_email("@example.com")

def test_validate_password_valid():
    assert validate_password("password123") == "password123"

def test_validate_password_too_short():
    with pytest.raises(HTTPException):
        validate_password("short")

def test_validate_text_length():
    assert validate_text_length("Valid text", 5, 20, "Test") == "Valid text"

def test_validate_text_length_too_short():
    with pytest.raises(HTTPException):
        validate_text_length("Hi", 5, 20, "Test")

def test_validate_file_extension_valid():
    assert validate_file_extension("document.pdf") == ".pdf"

def test_validate_file_extension_invalid():
    with pytest.raises(HTTPException):
        validate_file_extension("file.exe")

def test_sanitize_input():
    assert sanitize_input("  text  ") == "text"
    assert sanitize_input("text\x00") == "text"
