import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyDAWXzG9uEtgEl4aFt6BZevijg1j6rGzS0"

print("Listing available Gemini models...")
genai.configure(api_key=GEMINI_API_KEY)

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"- {model.name}")
