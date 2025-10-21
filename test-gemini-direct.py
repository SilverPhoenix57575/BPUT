import google.generativeai as genai
import os

# Test Gemini API directly
GEMINI_API_KEY = "AIzaSyDAWXzG9uEtgEl4aFt6BZevijg1j6rGzS0"

print("Testing Gemini API...")
print(f"API Key: {GEMINI_API_KEY[:20]}...")

try:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    # Test 1: Simple question
    print("\n=== Test 1: Simple Question ===")
    response = model.generate_content("What is 2+2? Answer in one sentence.")
    print(f"[OK] Response: {response.text}")
    
    # Test 2: Quiz generation
    print("\n=== Test 2: Quiz Generation ===")
    quiz_prompt = """Generate 2 quiz questions about Python.

Format:
Q: [question]
A) [option 1]
B) [option 2]
C) [option 3]
D) [option 4]
Correct: [A/B/C/D]
Explanation: [explanation]

---"""
    
    response = model.generate_content(quiz_prompt)
    print(f"[OK] Quiz Response:\n{response.text[:500]}...")
    
    # Test 3: Mind map generation
    print("\n=== Test 3: Mind Map Generation ===")
    mindmap_prompt = """Create a mind map for "Python Programming".

Return ONLY JSON:
{
  "central": "Python Programming",
  "branches": [
    {"id": "1", "label": "Basics", "children": [{"id": "1.1", "label": "Variables"}]}
  ]
}"""
    
    response = model.generate_content(mindmap_prompt)
    print(f"[OK] Mind Map Response:\n{response.text[:300]}...")
    
    print("\n[SUCCESS] ALL TESTS PASSED - Gemini API is working!")
    
except Exception as e:
    print(f"\n[ERROR]: {str(e)}")
    print(f"Error type: {type(e).__name__}")
    import traceback
    traceback.print_exc()
