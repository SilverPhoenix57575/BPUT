import google.generativeai as genai
from ..config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

class AIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def enhance_content(self, text: str, level: str) -> str:
        prompt = f"""Simplify this content for a {level} level student. Make it clear and engaging:

{text}

Provide a simplified version that's easy to understand."""
        
        response = self.model.generate_content(prompt)
        return response.text
    
    async def answer_question(self, question: str, content_id: str = None) -> str:
        prompt = f"""Answer this question clearly and concisely:

Question: {question}

Provide a helpful answer suitable for a computer science student."""
        
        response = self.model.generate_content(prompt)
        return response.text
    
    async def generate_quiz(self, content_id: str, num_questions: int) -> list:
        prompt = f"""Generate {num_questions} multiple choice questions about computer science fundamentals.

Format each question as:
Question: [question text]
A) [option]
B) [option]
C) [option]
D) [option]
Correct: [A/B/C/D]
Explanation: [brief explanation]"""
        
        response = self.model.generate_content(prompt)
        
        return [
            {
                "id": f"q{i+1}",
                "question": f"Sample question {i+1}",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": 0,
                "explanation": "This is the correct answer because..."
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
