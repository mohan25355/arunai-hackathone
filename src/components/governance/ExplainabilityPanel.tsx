import { useState } from 'react';
import {
  FileText,
  Brain,
  Scale,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ExplainabilityData, HallucinationCheck, BiasAnalysis } from '@/types/governance';

interface ExplainabilityPanelProps {
  explainability: ExplainabilityData;
  hallucinationCheck: HallucinationCheck;
  biasAnalysis: BiasAnalysis;
  governanceNote?: string;
}

export function ExplainabilityPanel({
  explainability,
  hallucinationCheck,
  biasAnalysis,
  governanceNote
}: ExplainabilityPanelProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('governance');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const isWithheld = explainability.modelUsed === 'none';

  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Explainability & Transparency</h3>
          {explainability.fallbackTriggered && (
            <Badge variant="warning" className="ml-2 animate-pulse border-amber-500 text-amber-500 bg-amber-500/10">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Gemini Fallback Active
            </Badge>
          )}
        </div>
      </div>

      <div className="divide-y divide-border">

        {/* Governance Explanation (Dynamic) */}
        {governanceNote && (
          <div className="p-4 bg-primary/5">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              Governance Explanation
            </h4>
            <p className="text-sm text-foreground/90 italic border-l-2 border-primary pl-3 py-1">
              "{governanceNote.replace('Action: ', '')}"
            </p>
          </div>
        )}

        {/* About TrustLens (Static) */}
        <div>
          <button
            onClick={() => toggleSection('about')}
            className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-medium">About TrustLens</span>
            </div>
            {expandedSection === 'about' ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </button>
          {expandedSection === 'about' && (
            <div className="px-4 pb-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                TrustLens is a Responsible AI Governance Platform that supervises generative AI systems such as OpenAI and Gemini. It enforces policies, detects bias and hallucinations, enables human oversight, and ensures that AI outputs are explainable, auditable, and safe for enterprise and regulated environments.
              </p>
            </div>
          )}
        </div>

        {/* Sources Section - Hide if withheld */}
        {!isWithheld && (
          <div>
            <button
              onClick={() => toggleSection('sources')}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-medium">Knowledge Sources</span>
                <Badge variant="outline">{explainability.sources.length}</Badge>
              </div>
              {expandedSection === 'sources' ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {expandedSection === 'sources' && (
              <div className="px-4 pb-4 space-y-3">
                {explainability.sources.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No knowledge sources retrieved.</p>
                ) : (
                  explainability.sources.map((source) => (
                    <div key={source.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                      <p className="font-medium text-sm">{source.title}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Hallucination Check Section - Hide if withheld */}
        {!isWithheld && (
          <div>
            <button
              onClick={() => toggleSection('hallucination')}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-primary" />
                <span className="font-medium">Hallucination Check</span>
                <Badge
                  variant={hallucinationCheck.score >= 90 ? 'success' : hallucinationCheck.score >= 70 ? 'warning' : 'destructive'}
                >
                  {hallucinationCheck.score}% grounded
                </Badge>
              </div>
              {expandedSection === 'hallucination' ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </button>

            {expandedSection === 'hallucination' && (
              <div className="px-4 pb-4 space-y-3">
                {/* Content ... */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/30">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-success">Factual Accuracy Verified</p>
                    <p className="text-xs text-muted-foreground">
                      {hallucinationCheck.factualDriftDetected
                        ? 'Minor factual drift detected - review recommended'
                        : 'No factual drift detected in response'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bias Analysis Section - Hide if withheld */}
        {!isWithheld && (
          <div>
            {/* ... existing bias code ... */}
            <button
              onClick={() => toggleSection('bias')}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Scale className="w-4 h-4 text-primary" />
                <span className="font-medium">Bias Analysis</span>
                <Badge
                  variant={biasAnalysis.overallScore <= 20 ? 'success' : biasAnalysis.overallScore <= 50 ? 'warning' : 'destructive'}
                >
                  {biasAnalysis.overallScore}% bias score
                </Badge>
              </div>
              {expandedSection === 'bias' ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </button>
            {expandedSection === 'bias' && (
              <div className="px-4 pb-4 space-y-3">
                {/* ... existing bias code ... */}
                {biasAnalysis.categories.length === 0 ? <p className="text-xs text-muted-foreground">No bias detected.</p> : biasAnalysis.categories.map((category) => (
                  <div key={category.category} className="p-3 rounded-lg bg-secondary/50">
                    {/* ... */}
                    <span className="font-medium text-sm">{category.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
