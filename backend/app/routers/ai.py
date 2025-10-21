from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from ..services.ai_service import AIService
from ..validators import validate_text_length, sanitize_input
from ..constants import (
    MIN_QUESTION_LENGTH, MAX_TEXT_LENGTH, MIN_ENHANCE_TEXT_LENGTH,
    MAX_ENHANCE_TEXT_LENGTH, MAX_QUIZ_QUESTIONS, DEFAULT_QUIZ_QUESTIONS
)
from ..logger import setup_logger

logger = setup_logger(__name__)

router = APIRouter()
ai_service = AIService()

class EnhanceRequest(BaseModel):
    text: str
    level: str = Field(default="beginner")

class QuestionRequest(BaseModel):
    question: str
    contentId: Optional[str] = None
    userId: Optional[str] = None
    chatHistory: Optional[list] = None

class QuizRequest(BaseModel):
    contentId: str
    competencyId: str
    numQuestions: int = Field(default=DEFAULT_QUIZ_QUESTIONS, ge=1, le=MAX_QUIZ_QUESTIONS)

@router.post("/enhance")
async def enhance_content(request: EnhanceRequest):
    try:
        text = validate_text_length(
            sanitize_input(request.text),
            MIN_ENHANCE_TEXT_LENGTH,
            MAX_ENHANCE_TEXT_LENGTH,
            "Text"
        )
        logger.info(f"Enhancing content for level: {request.level}")
        enhanced = await ai_service.enhance_content(text, request.level)
        logger.info("Content enhanced successfully")
        return {
            "success": True,
            "data": {
                "enhancedText": enhanced
            }
        }
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid input: {str(e)}")
    except Exception as e:
        logger.error(f"Enhancement error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to enhance content. Please try again.")

@router.post("/question")
async def ask_question(request: QuestionRequest):
    try:
        question = validate_text_length(
            sanitize_input(request.question),
            MIN_QUESTION_LENGTH,
            MAX_TEXT_LENGTH,
            "Question"
        )
        logger.info(f"Received question: {question[:50]}... for user: {request.userId}")
        logger.info(f"ContentId: {request.contentId}")
        answer = await ai_service.answer_question(question, request.contentId, request.chatHistory)
        logger.info("Question answered successfully")
        return {
            "success": True,
            "data": {
                "answer": answer
            }
        }
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid question: {str(e)}")
    except Exception as e:
        logger.error(f"Question answering error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to answer question: {str(e)}")

@router.post("/quiz")
async def generate_quiz(request: QuizRequest):
    try:
        logger.info(f"Generating {request.numQuestions} questions for competency: {request.competencyId}")
        questions = await ai_service.generate_quiz(request.contentId, request.numQuestions)
        logger.info("Quiz generated successfully")
        return {
            "success": True,
            "data": {
                "questions": questions
            }
        }
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid quiz request: {str(e)}")
    except Exception as e:
        logger.error(f"Quiz generation error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to generate quiz. Please try again.")

@router.post("/feedback")
async def generate_feedback(answer: str, question: str):
    try:
        feedback = await ai_service.generate_feedback(answer, question)
        return {
            "success": True,
            "data": {"feedback": feedback}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/simplify")
async def simplify_content(text: str):
    try:
        simplified = await ai_service.simplify_content(text)
        return {
            "success": True,
            "data": {"simplifiedText": simplified}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
