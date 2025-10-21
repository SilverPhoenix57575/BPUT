import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_enhance_content():
    response = client.post("/api/ai/enhance", json={
        "text": "This is a test content for enhancement.",
        "level": "beginner"
    })
    assert response.status_code == 200
    assert "enhancedText" in response.json()

def test_enhance_content_too_short():
    response = client.post("/api/ai/enhance", json={
        "text": "Short",
        "level": "beginner"
    })
    assert response.status_code == 422

def test_ask_question():
    response = client.post("/api/ai/question", json={
        "question": "What is Python?",
        "userId": "test_user"
    })
    assert response.status_code == 200
    assert "answer" in response.json()

def test_generate_quiz():
    response = client.post("/api/ai/quiz", json={
        "contentId": "test_content",
        "competencyId": "programming",
        "numQuestions": 5
    })
    assert response.status_code == 200
    assert "questions" in response.json()
