import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_signup_success():
    response = client.post("/api/auth/signup", json={
        "email": "test@example.com",
        "password": "password123",
        "role": "student"
    })
    assert response.status_code == 200
    assert "token" in response.json()
    assert "userId" in response.json()

def test_signup_duplicate_email():
    client.post("/api/auth/signup", json={
        "email": "duplicate@example.com",
        "password": "password123"
    })
    response = client.post("/api/auth/signup", json={
        "email": "duplicate@example.com",
        "password": "password123"
    })
    assert response.status_code == 400

def test_login_success():
    client.post("/api/auth/signup", json={
        "email": "login@example.com",
        "password": "password123"
    })
    response = client.post("/api/auth/login", json={
        "email": "login@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "token" in response.json()

def test_login_invalid_credentials():
    response = client.post("/api/auth/login", json={
        "email": "nonexistent@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
