import requests
import json

BASE_URL = "http://127.0.0.1:8000/policies"

def print_res(res):
    print(f"{res.status_code}: {res.text}")

print("1. Listing Policies...")
res = requests.get(BASE_URL)
print_res(res)

print("\n2. Creating Policy...")
new_policy = {
    "id": "test_pol_123",
    "name": "No SQL Injection",
    "description": "Prevent SQL injection attacks",
    "isActive": True,
    "rules": ["sql_pattern"]
}
res = requests.post(BASE_URL, json=new_policy)
print_res(res)

print("\n3. Updating Policy...")
res = requests.put(f"{BASE_URL}/test_pol_123", json={"isActive": False})
print_res(res)

print("\n4. Deleting Policy...")
res = requests.delete(f"{BASE_URL}/test_pol_123")
print_res(res)

print("\n5. Verification List...")
res = requests.get(BASE_URL)
policies = res.json()
found = any(p['id'] == 'test_pol_123' for p in policies)
print(f"Test Policy Found: {found}")
