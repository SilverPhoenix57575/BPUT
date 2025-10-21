"""
Simple backend connectivity test - no dependencies required
"""
import urllib.request
import urllib.error
import json
import sys

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8000"

def test_endpoint(method, url, data=None):
    """Test an endpoint and return result"""
    try:
        if data:
            data = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(
                url, 
                data=data,
                headers={'Content-Type': 'application/json'},
                method=method
            )
        else:
            req = urllib.request.Request(url, method=method)
        
        with urllib.request.urlopen(req, timeout=5) as response:
            result = json.loads(response.read().decode('utf-8'))
            return True, response.status, result
    except urllib.error.HTTPError as e:
        try:
            error_body = json.loads(e.read().decode('utf-8'))
            return False, e.code, error_body
        except:
            return False, e.code, str(e)
    except Exception as e:
        return False, 0, str(e)

print("=" * 70)
print("BACKEND API CONNECTIVITY TEST")
print("=" * 70)
print()

# Test 1: Root endpoint
print("Test 1: GET /")
print("-" * 70)
success, status, result = test_endpoint("GET", f"{BASE_URL}/")
if success:
    print(f"✓ SUCCESS (Status: {status})")
    print(f"  Response: {json.dumps(result, indent=2)}")
else:
    print(f"✗ FAILED (Status: {status})")
    print(f"  Error: {result}")
print()

# Test 2: Health endpoint
print("Test 2: GET /health")
print("-" * 70)
success, status, result = test_endpoint("GET", f"{BASE_URL}/health")
if success:
    print(f"✓ SUCCESS (Status: {status})")
    print(f"  Response: {json.dumps(result, indent=2)}")
else:
    print(f"✗ FAILED (Status: {status})")
    print(f"  Error: {result}")
print()

# Test 3: AI Question endpoint (v1)
print("Test 3: POST /api/v1/ai/question")
print("-" * 70)
test_data = {
    "question": "What is 2+2?",
    "userId": "test_user",
    "chatHistory": []
}
success, status, result = test_endpoint("POST", f"{BASE_URL}/api/v1/ai/question", test_data)
if success:
    print(f"✓ SUCCESS (Status: {status})")
    print(f"  Response: {json.dumps(result, indent=2)[:200]}...")
else:
    print(f"✗ FAILED (Status: {status})")
    print(f"  Error: {result}")
print()

# Test 4: AI Question endpoint (legacy)
print("Test 4: POST /api/ai/question (legacy)")
print("-" * 70)
success, status, result = test_endpoint("POST", f"{BASE_URL}/api/ai/question", test_data)
if success:
    print(f"✓ SUCCESS (Status: {status})")
    print(f"  Response: {json.dumps(result, indent=2)[:200]}...")
else:
    print(f"✗ FAILED (Status: {status})")
    print(f"  Error: {result}")
print()

print("=" * 70)
print("SUMMARY")
print("=" * 70)
print()
print("If all tests passed:")
print("  ✓ Backend is running correctly")
print("  ✓ API endpoints are accessible")
print("  ✓ Frontend should be able to connect")
print()
print("If tests failed:")
print("  1. Check if backend is running: netstat -ano | findstr :8000")
print("  2. Start backend: cd backend && venv\\Scripts\\activate && uvicorn app.main:app --reload")
print("  3. Check backend/.env has GEMINI_API_KEY set")
print("  4. Check for errors in backend terminal")
print()
print("API Documentation: http://localhost:8000/api/v1/docs")
print("=" * 70)
