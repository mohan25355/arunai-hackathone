import { CheckCircle, Clock, Copy, ThumbsUp, ThumbsDown, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { GovernanceResponse } from '@/types/governance';
import { toast } from 'sonner';

interface ResponsePanelProps {
  response: GovernanceResponse;
}

export function ResponsePanel({ response }: ResponsePanelProps) {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending Review' },
    approved: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', label: 'Approved' },
    rejected: { icon: ThumbsDown, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Rejected' },
    modified: { icon: Edit, color: 'text-info', bg: 'bg-info/10', label: 'Modified' },
  };

  const config = statusConfig[response.status];
  const StatusIcon = config.icon;

  const copyResponse = () => {
    navigator.clipboard.writeText(response.response);
    toast.success('Response copied to clipboard');
  };

  return (
    <div className="glass-card overflow-hidden flex-1 flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', config.bg)}>
            <StatusIcon className={cn('w-4 h-4', config.color)} />
          </div>
          <div>
            <p className="font-semibold">Governed Response</p>
            <p className="text-xs text-muted-foreground">
              Generated at {response.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={`risk_${response.promptAnalysis.riskLevel}` as any}>
            {response.promptAnalysis.riskLevel} risk
          </Badge>
          <Badge variant="glow">
            {response.explainability.confidenceScore}% confidence
          </Badge>
        </div>
      </div>

      {/* Response Content */}
      <div className="flex-1 p-4 overflow-y-auto scrollbar-thin">
        <div className="prose prose-sm prose-invert max-w-none">
          <p className="whitespace-pre-wrap text-foreground leading-relaxed">
            {response.response}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/30">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>Model: <span className="text-primary font-mono">{response.explainability.modelUsed}</span></span>
          <span>Time: <span className="font-mono">{response.explainability.processingTime}s</span></span>
          <span>Sources: <span className="font-mono">{response.explainability.sources.length}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyResponse}>
            <Copy className="w-4 h-4 mr-1" />
            Copy
          </Button>
          <Button variant="ghost" size="sm">
            <ThumbsUp className="w-4 h-4 mr-1" />
            Approve
          </Button>
          <Button variant="ghost" size="sm">
            <ThumbsDown className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
