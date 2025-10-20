import google.generativeai as genai
from ..config import settings
from ..cache import ai_cache
import logging
import asyncio
from functools import partial

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)

class AIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    async def enhance_content(self, text: str, level: str) -> str:
        prompt = f"""Simplify this content for a {level} level student. Make it clear and engaging:

{text}

Provide a simplified version that's easy to understand."""
        
        response = self.model.generate_content(prompt)
        return response.text
    
    async def answer_question(self, question: str, content_id: str = None, chat_history: list = None) -> str:
        try:
            history_text = ""
            if chat_history:
                for msg in chat_history[-6:]:
                    role = "User" if msg.get("role") == "user" else "Assistant"
                    history_text += f"{role}: {msg.get('content', '')}\n"
            
            prompt = f"""You are a helpful AI learning assistant for computer science students.

{history_text}
User: {question}

Provide a clear, helpful answer:"""
            
            logger.info("Calling Gemini API...")
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, partial(self.model.generate_content, prompt))
            
            if not response or not response.text:
                raise ValueError("Empty response from Gemini API")
            
            answer = response.text
            logger.info(f"Got answer: {answer[:100]}...")
            return answer
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}", exc_info=True)
            raise Exception(f"AI service error: {str(e)}")
    
    async def generate_quiz(self, content_id: str, num_questions: int) -> list:
        try:
            prompt = f"""Generate {num_questions} multiple choice questions about computer science fundamentals.

For each question, provide EXACTLY in this format:
Q: [question text]
A) [option 1]
B) [option 2]
C) [option 3]
D) [option 4]
Correct: [A/B/C/D]
Explanation: [brief explanation]

Separate each question with ---"""
            
            logger.info("Generating quiz with Gemini...")
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(None, partial(self.model.generate_content, prompt))
            
            if not response or not response.text:
                raise ValueError("Empty response")
            
            # Parse the response
            questions = []
            blocks = response.text.split('---')
            
            for i, block in enumerate(blocks[:num_questions]):
                lines = [l.strip() for l in block.strip().split('\n') if l.strip()]
                if len(lines) < 6:
                    continue
                    
                q_text = lines[0].replace('Q:', '').strip()
                options = []
                correct_idx = 0
                explanation = ""
                
                for line in lines[1:]:
                    if line.startswith(('A)', 'B)', 'C)', 'D)')):
                        options.append(line[3:].strip())
                    elif line.startswith('Correct:'):
                        correct_letter = line.split(':')[1].strip().upper()[0]
                        correct_idx = ord(correct_letter) - ord('A')
                    elif line.startswith('Explanation:'):
                        explanation = line.split(':', 1)[1].strip()
                
                if len(options) == 4:
                    questions.append({
                        "id": f"q{i+1}",
                        "question": q_text,
                        "options": options,
                        "correctAnswer": correct_idx,
                        "explanation": explanation or "Correct answer selected."
                    })
            
            if not questions:
                raise ValueError("Failed to parse questions")
                
            return questions
            
        except Exception as e:
            logger.error(f"Quiz generation error: {e}")
            # Return demo questions as fallback
            return [
                {
                    "id": f"q{i+1}",
                    "question": "What is a variable in programming?",
                    "options": ["A container for data", "A loop", "A function", "A language"],
                    "correctAnswer": 0,
                    "explanation": "A variable stores data values."
                }
                for i in range(num_questions)
            ]
    
    async def generate_feedback(self, answer: str, question: str) -> str:
        prompt = f"""Provide constructive feedback on this answer:

Question: {question}
Student Answer: {answer}

Give encouraging feedback with suggestions for improvement."""
        
        response = self.model.generate_content(prompt)
        return response.text
    
    async def simplify_content(self, text: str) -> str:
        prompt = f"""Simplify this text for better understanding:

{text}

Make it clear and concise."""
        
        response = self.model.generate_content(prompt)
        return response.text
