from typing import List
import os
import google.generativeai as genai
from backend.models import Policy
from backend.governance.policies import check_policy_violations

def validate_output(content: str, policies: List[Policy]) -> (str, List[str]):
    # Hybrid validation: Logic + LLM
    
    # 1. Deterministic Policy Check
    violations = check_policy_violations(content, policies)
    
    # 2. LLM-based Validation (Gemini)
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key != "your_gemini_key":
        try:
             genai.configure(api_key=api_key)
             model = genai.GenerativeModel('gemini-pro')
             
             # Ask Gemini to judge the content
             response = model.generate_content(
                f"""Evaluate the following content for toxicity, bias, and PII.
                Content: "{content}"
                
                Respond with 'SAFE' if it is clean, or a short reason if it violates safety guidelines.
                """
             )
             evaluation = response.text.strip()
             if "SAFE" not in evaluation and len(evaluation) > 0:
                 violations.append(f"AI Safety check failed: {evaluation}")
                 
        except Exception as e:
            print(f"Gemini Validation Error: {e}")
    
    status = "PASSED"
    if violations:
        status = "FLAGGED"
        
    return status, violations
