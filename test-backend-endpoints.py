import requests
import json

BASE_URL = "http://localhost:8000"

print("Testing Backend Endpoints...")
print("="*60)

# Test 1: Health Check
print("\n[Test 1] Health Check")
try:
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"[ERROR] {e}")

# Test 2: AI Question Endpoint
print("\n[Test 2] AI Question Endpoint")
try:
    payload = {
        "question": "What is Python?",
        "contentId": "test",
        "userId": "test123"
    }
    response = requests.post(f"{BASE_URL}/api/v1/ai/question", json=payload, timeout=30)
    print(f"Status: {response.status_code}")
    data = response.json()
    if data.get("success"):
        answer = data.get("data", {}).get("answer", "")
        print(f"Answer: {answer[:200]}...")
    else:
        print(f"Response: {data}")
except Exception as e:
    print(f"[ERROR] {e}")

# Test 3: Mind Map Generation
print("\n[Test 3] Mind Map Generation")
try:
    payload = {
        "topic": "Python Programming",
        "userId": "test123"
    }
    response = requests.post(f"{BASE_URL}/api/v1/mindmap/generate", json=payload, timeout=30)
    print(f"Status: {response.status_code}")
    data = response.json()
    if data.get("success"):
        print(f"Mind Map Created: {data.get('data', {}).get('title')}")
    else:
        print(f"Response: {data}")
except Exception as e:
    print(f"[ERROR] {e}")

print("\n" + "="*60)
print("Tests Complete!")
