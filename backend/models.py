from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid

class PromptRequest(BaseModel):
    prompt: str
    model_provider: str = "openai"  # or "gemini"
    user_id: str

class RiskAssessment(BaseModel):
    risk_level: str  # LOW, MEDIUM, HIGH
    flags: List[str]
    score: float
    explanation: Optional[str] = None

class ReviewRequest(BaseModel):
    response_id: str
    action: str # APPROVE, REJECT
    comment: Optional[str] = None

class GovernanceResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    original_prompt: str
    risk_assessment: RiskAssessment
    generated_content: Optional[str] = None
    trust_score: float
    groundedness_score: float = 0.0
    confidence_score: float = 0.0
    validation_status: str # PASSED, BLOCKED, FLAGGED
    status: str = "PENDING" # NEW: PENDING, COMPLETED, FAILED
    violated_policies: List[str] = []
    rag_context: Optional[str] = None
    rag_sources: List[Dict[str, Any]] = []
    
    # Failover Metadata
    model_used: str = "openai"
    fallback_triggered: bool = False
    governance_note: Optional[str] = None
    
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Policy(BaseModel):
    id: str
    name: str
    description: str
    isActive: bool
    rules: List[str]
