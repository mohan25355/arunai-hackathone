import { useState } from 'react';
import { Send, Loader2, Shield, Brain, Scale, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PromptAnalysisPanel } from './PromptAnalysisPanel';
import { ResponsePanel } from './ResponsePanel';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import type { GovernanceResponse } from '@/types/governance';

export function PromptGovernance() {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<GovernanceResponse | null>(null);
  const [processingStep, setProcessingStep] = useState<string>('');

  const processPrompt = async () => {
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setResponse(null);
    setProcessingStep('Initializing governance pipeline...');

    try {
      const res = await fetch('http://localhost:8000/governed-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          // model_provider: 'openai', // Not needed for this specific endpoint as per user snippet
        }),
      });

      if (!res.ok) throw new Error('Governance engine failed');

      setProcessingStep('Processing with Gemini & OpenAI...');
      const data = await res.json();

      // Map Backend Response to Frontend UI Model
      const mappedResponse: GovernanceResponse = {
        id: crypto.randomUUID(),
        prompt: prompt,
        response: data.answer || data.explanation || "Response withheld.",

        // Pass raw scores
        trustScore: data.risk_score ? Math.max(0, 10 - (data.risk_score / 10)) : 0, // Approx trust from risk
        groundednessScore: data.groundedness || 0,
        confidenceScore: data.confidence || 0,
        governanceNote: data.explanation,

        promptAnalysis: {
          riskLevel: (data.risk_score > 50 || data.status === 'blocked') ? 'high' : 'low',
          riskScore: data.risk_score || 0,
          biasIndicators: [],
          sensitiveTopics: data.matched_keywords || [],
          policyViolations: data.status === 'blocked' ? ['Safety Violation'] : [],
        },
        hallucinationCheck: {
          score: Math.round(data.groundedness || 0),
          unsupportedClaims: [],
          factualDriftDetected: false,
        },
        biasAnalysis: {
          overallScore: 10,
          categories: [],
        },
        explainability: {
          sources: [], // No sources in new simplistic response yet
          modelUsed: data.model_used || 'none',
          modelVersion: '2024-02',
          reasoningSteps: [
            `Model: ${data.model_used?.toUpperCase()}`,
            data.explanation || "Governance Checks Complete",
            `Risk Score: ${data.risk_score}`,
          ],
          confidenceScore: Math.round(data.confidence || 0),
          processingTime: 1.2,
          fallbackTriggered: data.model_used === 'gemini_fallback'
        },
        policyCompliant: data.status === 'success',
        requiresReview: data.status === 'withheld',
        timestamp: new Date(),
        status: data.status === 'success' ? 'approved' : 'rejected',
        modelUsed: data.model_used,
        fallbackTriggered: data.model_used === 'gemini_fallback',
      };

      setProcessingStep('Finalizing governance report...');
      setResponse(mappedResponse);

    } catch (error) {
      console.error("Governance Error:", error);
      // Stick with simulated error or show toast (not implemented here)
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="h-full flex flex-col p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">AI Governance Engine</h1>
        <p className="text-muted-foreground">Submit prompts for governed AI response generation</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Left Panel - Input & Response */}
        <div className="flex flex-col gap-4">
          {/* Input Section */}
          <div className="glass-card p-4">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Enter Prompt for Governance Analysis
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here. The governance engine will analyze for bias, policy compliance, and generate a grounded response..."
                className="w-full h-32 p-4 pr-12 rounded-lg bg-secondary/50 border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground"
                disabled={isProcessing}
              />
              <Button
                onClick={processPrompt}
                disabled={!prompt.trim() || isProcessing}
                variant="glow"
                size="icon"
                className="absolute bottom-3 right-3"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Processing Status */}
          {isProcessing && (
            <div className="glass-card p-4 border-primary/30 animate-glow-pulse">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                  <Shield className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div>
                  <p className="font-medium text-primary">Governance Pipeline Active</p>
                  <p className="text-sm text-muted-foreground">{processingStep}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-shimmer"
                  style={{
                    width: '100%',
                    background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)',
                    backgroundSize: '200% 100%',
                  }}
                />
              </div>
            </div>
          )}

          {/* Response Panel */}
          {response && !isProcessing && (
            <ResponsePanel response={response} />
          )}
        </div>

        {/* Right Panel - Analysis & Explainability */}
        <div className="flex flex-col gap-4 overflow-y-auto scrollbar-thin">
          {response && !isProcessing ? (
            <>
              <PromptAnalysisPanel analysis={response.promptAnalysis} />
              <ExplainabilityPanel
                explainability={response.explainability}
                hallucinationCheck={response.hallucinationCheck}
                biasAnalysis={response.biasAnalysis}
                governanceNote={response.governanceNote}
              />
            </>
          ) : (
            <div className="flex-1 glass-card flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-primary/50" />
              </div>
              <h3 className="text-lg font-medium mb-2">Governance Analysis</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Submit a prompt to see real-time bias detection, hallucination checks, and explainability data.
              </p>
              <div className="flex items-center gap-6 mt-8">
                <div className="flex flex-col items-center gap-2">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Policy Check</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Scale className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Bias Detection</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <FileSearch className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Source Validation</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
