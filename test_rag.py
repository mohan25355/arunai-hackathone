import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

print("1. Adding Document...")
doc = {"title": "TrustLens Origins", "content": "TrustLens was founded in 2026 by the AI Safety Team to ensure responsible AI deployment."}
res = requests.post(f"{BASE_URL}/documents", json=doc)
print(f"Status: {res.status_code}, Body: {res.text}")

print("\n2. Searching (via Prompt)...")
prompt = {"prompt": "When was TrustLens founded?", "provider": "openai", "user_id": "test_rag"}
res = requests.post(f"{BASE_URL}/submit-prompt", json=prompt)

try:
    data = res.json()
    print(f"\nResponse Context: {data.get('rag_context', 'No context')[:100]}...")
    sources = data.get('rag_sources', [])
    print(f"Structured Sources Returned: {len(sources)}")
    if len(sources) > 0:
        print(f"First Source: {sources[0]['title']}")
    print(f"Generated Content: {data.get('generated_content')}")
except Exception as e:
    print(f"Error parse: {e}")
