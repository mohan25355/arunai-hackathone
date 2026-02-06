from backend.models import Policy
from typing import List

# Simple policy engine to match rules

def check_policy_violations(text: str, policies: List[Policy]) -> List[str]:
    violations = []
    text_lower = text.lower()
    
    for policy in policies:
        # Policies are coming as dicts from db.get_policies()
        if not policy.get("active"):
            continue
            
        name = policy.get("name")
        if name == "No PII":
             # Very naive PII detection for hackathon
            if "@" in text and "." in text: # Email-ish
                violations.append("Possible Email Address detected")
            if any(char.isdigit() for char in text) and len(text) > 9: # Phone-ish
                violations.append("Possible Phone Number or ID detected")
                
        if name == "Toxic Content":
            toxic_keywords = ["hate", "kill", "stupid", "idiot"]
            if any(word in text_lower for word in toxic_keywords):
                violations.append(f"Toxic content detected: {name}")

    return violations
