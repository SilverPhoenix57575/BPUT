from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

class EnhanceRequest(BaseModel):
    text: str
    level: str = "beginner"

class QuestionRequest(BaseModel):
    question: str
    contentId: str = None
    userId: str = "default_user"

class QuizRequest(BaseModel):
    contentId: str
    competencyId: str
    numQuestions: int = 5

@router.post("/enhance")
async def enhance_content(request: EnhanceRequest):
    try:
        enhanced = await ai_service.enhance_content(request.text, request.level)
        return {
            "enhancedText": enhanced,
            "readabilityScore": 8.5
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/question")
async def ask_question(request: QuestionRequest):
    try:
        answer = await ai_service.answer_question(request.question, request.contentId)
        return {
            "answer": answer,
            "citations": [],
            "confidence": 0.92
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quiz")
async def generate_quiz(request: QuizRequest):
    try:
        questions = await ai_service.generate_quiz(request.contentId, request.numQuestions)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback")
async def generate_feedback(answer: str, question: str):
    try:
        feedback = await ai_service.generate_feedback(answer, question)
        return {"feedback": feedback}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/simplify")
async def simplify_content(text: str):
    try:
        simplified = await ai_service.simplify_content(text)
        return {"simplifiedText": simplified}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
