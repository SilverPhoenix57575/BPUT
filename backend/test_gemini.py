import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded: {api_key[:20]}..." if api_key else "No API key found")

genai.configure(api_key=api_key)

# Test with the correct model name
model = genai.GenerativeModel('gemini-1.5-flash')

print("\n🧪 Testing Gemini API...")
print("-" * 50)

try:
    response = model.generate_content("What is Python programming language? Answer in 2 sentences.")
    print("✅ SUCCESS! Gemini API is working!\n")
    print("Response:")
    print(response.text)
    print("-" * 50)
except Exception as e:
    print(f"❌ ERROR: {str(e)}")
    print("-" * 50)
