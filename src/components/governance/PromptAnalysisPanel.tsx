import { AlertTriangle, CheckCircle, Info, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PromptAnalysis } from '@/types/governance';

interface PromptAnalysisPanelProps {
  analysis: PromptAnalysis;
}

export function PromptAnalysisPanel({ analysis }: PromptAnalysisPanelProps) {
  const riskConfig = {
    low: { color: 'text-success', bg: 'bg-success/10', border: 'border-success/30', icon: CheckCircle },
    medium: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', icon: AlertTriangle },
    high: { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', icon: AlertTriangle },
  };

  const config = riskConfig[analysis.riskLevel];
  const Icon = config.icon;

  return (
    <div className="glass-card overflow-hidden animate-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Input Analysis</h3>
        </div>
        <Badge variant={`risk_${analysis.riskLevel}` as any}>
          Risk: {analysis.riskLevel.toUpperCase()}
        </Badge>
      </div>

      <div className="p-4 space-y-4">
        {/* Risk Score */}
        <div className={cn('p-4 rounded-lg', config.bg, 'border', config.border)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className={cn('w-5 h-5', config.color)} />
              <div>
                <p className="font-medium">Risk Score</p>
                <p className="text-xs text-muted-foreground">Based on content analysis</p>
              </div>
            </div>
            <span className={cn('text-3xl font-bold', config.color)}>
              {analysis.riskScore}%
            </span>
          </div>
        </div>

        {/* Bias Indicators */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium">Bias Indicators</p>
            <Badge variant="outline" className="text-xs">
              {analysis.biasIndicators.length} found
            </Badge>
          </div>
          {analysis.biasIndicators.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {analysis.biasIndicators.map((indicator, i) => (
                <Badge key={i} variant="warning">{indicator}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-success flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              No bias indicators detected
            </p>
          )}
        </div>

        {/* Sensitive Topics */}
        {analysis.sensitiveTopics.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium">Sensitive Topics</p>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap gap-2">
              {analysis.sensitiveTopics.map((topic, i) => (
                <Badge key={i} variant="info">{topic.replace('_', ' ')}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Policy Violations */}
        <div>
          <p className="text-sm font-medium mb-2">Policy Violations</p>
          {analysis.policyViolations.length > 0 ? (
            <div className="space-y-2">
              {analysis.policyViolations.map((violation, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-destructive/10 border border-destructive/30">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">{violation}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-success flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              No policy violations
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
