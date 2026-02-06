
HARMFUL_KEYWORDS = [
    "kill", "poison", "death", "suicide",
    "murder", "bomb", "harm", "attack"
]

def detect_harmful_content(prompt: str):
    prompt_lower = prompt.lower()
    matched = [kw for kw in HARMFUL_KEYWORDS if kw in prompt_lower]

    if matched:
        return {
            "is_harmful": True,
            "matched_keywords": matched,
            "risk_level": "HIGH"
        }

    return {
        "is_harmful": False,
        "matched_keywords": [],
        "risk_level": "LOW"
    }
