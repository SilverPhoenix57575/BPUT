import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key: {api_key[:20]}...")

genai.configure(api_key=api_key)

print("\n📋 Available Models:")
print("-" * 50)

try:
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"✅ {model.name}")
except Exception as e:
    print(f"❌ Error listing models: {e}")

print("\n🧪 Testing gemini-pro:")
try:
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content("Say hello")
    print(f"✅ Works! Response: {response.text[:50]}")
except Exception as e:
    print(f"❌ Failed: {e}")
