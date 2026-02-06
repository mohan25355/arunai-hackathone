export type RiskLevel = 'low' | 'medium' | 'high';

export interface PromptAnalysis {
  riskLevel: RiskLevel;
  riskScore: number;
  biasIndicators: string[];
  sensitiveTopics: string[];
  policyViolations: string[];
}

export interface Source {
  id: string;
  title: string;
  content: string;
  relevanceScore: number;
  documentType: string;
}

export interface HallucinationCheck {
  score: number;
  unsupportedClaims: string[];
  factualDriftDetected: boolean;
}

export interface BiasAnalysis {
  overallScore: number;
  categories: {
    category: string;
    score: number;
    description: string;
  }[];
}

export interface ExplainabilityData {
  sources: Source[];
  modelUsed: string;
  modelVersion: string;
  reasoningSteps: string[];
  confidenceScore: number;
  processingTime: number;
  fallbackTriggered?: boolean;
}

export interface GovernanceResponse {
  id: string;
  prompt: string;
  response: string;
  // Raw Backend Scores
  trustScore?: number;
  groundednessScore?: number;
  confidenceScore?: number;
  governanceNote?: string;

  promptAnalysis: PromptAnalysis;
  hallucinationCheck: HallucinationCheck;
  biasAnalysis: BiasAnalysis;
  explainability: ExplainabilityData;
  policyCompliant: boolean;
  requiresReview: boolean;
  timestamp: Date;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
  reviewer?: string;
  reviewNotes?: string;
  // Failover
  modelUsed?: string;
  fallbackTriggered?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  riskLevel: RiskLevel;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  rules: PolicyRule[];
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyRule {
  id: string;
  type: 'block' | 'warn' | 'require_review';
  condition: string;
  message: string;
}

export interface DashboardMetrics {
  total_prompts: number;
  approved_responses: number;
  pending_review: number;
  policy_violations: number;
  trust_scores: {
    overall_trust: number;
    bias_risk: number;
  };
  hallucination: {
    grounded: number;
    avg_confidence: number;
    hallucination_rate: number;
  };
}
