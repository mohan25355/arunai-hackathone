from backend.models import RiskAssessment

def calculate_trust_score(
    risk: RiskAssessment, 
    policy_violations: int, 
    model_used: str = "openai",
    fallback_triggered: bool = False,
    source_count: int = 0,
    rag_relevance_score: float = 0.0
) -> dict:
    """
    Calculates detailed governance scores based on risk, system state, and evidence.
    Returns: { 'trust': float, 'groundedness': float, 'confidence': float }
    """
    
    # 1. Base Scores
    trust = 100.0
    groundedness = 100.0 if source_count > 0 else 50.0 # Default moderate if no sources
    confidence = 100.0

    # 2. Logic: System Integrity (The "Hard Rules")
    if model_used == "none" or model_used == "mock":
        return {
            "trust": 0.0,
            "groundedness": 0.0,
            "confidence": 0.0
        }
    
    # 3. Penalties & Bonuses
    
    # Risk Penalties (affects Trust)
    if risk.risk_level == "HIGH":
        trust -= 50
    elif risk.risk_level == "MEDIUM":
        trust -= 20
    trust -= (risk.score * 10)
    
    # Policy Penalties
    trust -= (policy_violations * 20)
    
    # Fallback Penalties
    if fallback_triggered:
        groundedness -= 10
        confidence -= 20
        trust -= 10

    # Source / RAG Impact
    if source_count == 0:
        groundedness = min(groundedness, 40.0) # Cap at 40 if no sources
        confidence -= 15
    elif source_count >= 2:
        confidence += 5 # Bonus for multiple sources
        
    # RAG Relevance
    if rag_relevance_score > 0.7:
        groundedness += 10
        confidence += 5
    elif rag_relevance_score < 0.3 and source_count > 0:
        groundedness -= 20 # Irrelevant sources
        
    # Validation penalty (if violated policies)
    if policy_violations > 0:
        confidence -= 15 * policy_violations
        
    # Clamping
    return {
        "trust": max(0.0, min(100.0, trust)),
        "groundedness": max(0.0, min(100.0, groundedness)),
        "confidence": max(0.0, min(100.0, confidence))
    }
