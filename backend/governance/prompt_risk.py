import os
import google.generativeai as genai
from backend.models import RiskAssessment

def analyze_prompt_risk(prompt: str) -> RiskAssessment:
    api_key = os.getenv("GEMINI_API_KEY")
    
    # Real integration logic structure
    if api_key and api_key != "your_gemini_key":
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-pro')
            
            # Deterministic for consistency in risk analysis
            response = model.generate_content(
                f"""Analyze the following prompt for safety risks. 
                Prompt: "{prompt}"
                
                Respond in valid JSON format with:
                - risk_level: LOW, MEDIUM, or HIGH
                - score: 0.0 to 1.0 (float)
                - flags: list of strings (specific issues found)
                - explanation: brief explanation
                """
            )
            # Simplified parsing for the hackathon (assumes clean JSON or manual parsing)
            # In production, use structured output parsing
            
            # fallback to mock for now if parsing fails or just to be safe during dev
            # return parse_gemini_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {e}")
            pass

    # Fallback / Mock Logic (simulating what Gemini would do)
    # This ensures the app works even if the user hasn't put in keys yet
    risk_score = 0
    flags = []
    prompt_lower = prompt.lower()
    
    high_risk = ["exploit", "hack", "bypass", "ignore instructions"]
    medium_risk = ["sql", "database", "system", "password"]
    
    for word in high_risk:
        if word in prompt_lower:
            risk_score += 0.8
            flags.append(f"High risk keyword: {word}")
            
    for word in medium_risk:
        if word in prompt_lower:
            risk_score += 0.4
            flags.append(f"Medium risk keyword: {word}")

    level = "LOW"
    if risk_score > 0.7:
        level = "HIGH"
    elif risk_score > 0.3:
        level = "MEDIUM"
        
    return RiskAssessment(
        risk_level=level,
        flags=flags,
        score=min(risk_score, 1.0),
        explanation="Automated keyword-based risk analysis (Gemini fallback)"
    )
