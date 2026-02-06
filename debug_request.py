import requests
import json

url = "http://127.0.0.1:8000/submit-prompt"
headers = {"Content-Type": "application/json"}
data = {
    "prompt": "Test prompt for governance analysis",
    "user_id": "test_user_DEBUG"
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, headers=headers, json=data, timeout=10)
    print(f"Status: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Request failed: {e}")
