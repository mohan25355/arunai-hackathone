import requests
import json

url = "http://127.0.0.1:8000/submit-prompt"
data = {
    "prompt": "Test",
    "model_provider": "openai",
    "user_id": "debug"
}
try:
    res = requests.post(url, json=data)
    print(json.dumps(res.json(), indent=2))
except Exception as e:
    print(e)
