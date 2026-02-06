import requests
import json
import time

url = "http://127.0.0.1:8000/submit-prompt"
headers = {"Content-Type": "application/json"}
data = {
    "prompt": "Explain potential risks of AGI.",
    "model_provider": "openai",
    "user_id": "test_user_FAILOVER"
}

print(f"Sending request to {url} (expecting OpenAI or Gemini fallback)...")
start = time.time()
try:
    response = requests.post(url, headers=headers, json=data, timeout=30)
    elapsed = time.time() - start
    
    print(f"Status: {response.status_code}")
    print(f"Time: {elapsed:.2f}s")
    
    if response.status_code == 200:
        res_json = response.json()
        print("\n--- Response Metadata ---")
        print(f"Model Used: {res_json.get('model_used')}")
        print(f"Fallback Triggered: {res_json.get('fallback_triggered')}")
        print(f"Status: {res_json.get('status')}")
        print(f"Validation: {res_json.get('validation_status')}")
        print("-" * 30)
        print(f"Content Preview: {res_json.get('generated_content')[:100]}...")
    else:
        print(f"Error: {response.text}")

except Exception as e:
    print(f"Request failed: {e}")
