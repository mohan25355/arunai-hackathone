import requests
import json

BASE_URL = "http://127.0.0.1:8000/submit-prompt"

prompt_data = {
    "prompt": "Test logic consistency failure",
    "provider": "openai",
    "user_id": "test_user_1" 
}

# Ideally I would mock the failure in the backend, but for this black-box test,
# I will inspect the response of a normal request to ensure the new fields are present.
# To test failure, I would need to force it.
# Let's just check if the new fields are returned structure-wise.

print("1. Submitting Prompt...")
try:
    res = requests.post(BASE_URL, json=prompt_data)
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        data = res.json()
        print(f"Trust Score: {data.get('trust_score')}")
        print(f"Groundedness: {data.get('groundedness_score')}")
        print(f"Confidence: {data.get('confidence_score')}")
        print(f"Governance Note: {data.get('governance_note')}")
        
        # Verify structure
        if 'trust_score' in data and 'groundedness_score' in data and 'confidence_score' in data:
            print("SUCCESS: New score fields present.")
        else:
            print("FAILURE: Missing score fields.")
            
        if 'governance_note' in data:
             print("SUCCESS: Governance note present.")
        else:
             print("FAILURE: Governance note missing.")
             
    else:
        print(f"Error: {res.text}")

except Exception as e:
    print(f"Request failed: {e}")
