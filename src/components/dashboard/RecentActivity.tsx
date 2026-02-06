import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id?: string;
  original_prompt: string;
  timestamp: string;
  validation_status: string;
  risk_assessment: {
    risk_level: string;
    flags: string[];
  };
  generated_content?: string;
  status?: string;
}

interface RecentActivityProps {
  data?: ActivityItem[];
}

const typeConfig: any = {
  PASSED: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  BLOCKED: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
  PENDING: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  FLAGGED: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
  MODIFIED: { icon: Edit, color: 'text-info', bg: 'bg-info/10' },
};

export function RecentActivity({ data = [] }: RecentActivityProps) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-6 text-center text-muted-foreground">
        No recent activity
      </div>
    )
  }

  const handleReview = async (id: string, action: 'APPROVE' | 'REJECT', e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    try {
      await fetch('http://localhost:8000/human-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response_id: id,
          action: action,
          comment: "Manual review from dashboard"
        })
      });
      // Optimistic update or wait for refresh interval
    } catch (err) {
      console.error("Review failed", err);
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <Badge variant="outline" className="font-mono">Live</Badge>
      </div>

      <div className="divide-y divide-border">
        {data.map((activity, idx) => {
          let type = activity.validation_status || 'PENDING';
          if (activity.status === 'PENDING') type = 'PENDING';

          const config = typeConfig[type] || typeConfig['PENDING'];
          const Icon = config.icon;

          const riskLevel = activity.risk_assessment?.risk_level?.toLowerCase() || 'low';
          const timeAgo = activity.timestamp ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : 'just now';

          const needsReview = (type === 'PENDING' || type === 'FLAGGED') && activity.status !== 'COMPLETED' && activity.status !== 'FAILED';

          return (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className={cn('p-2 rounded-lg', config.bg)}>
                <Icon className={cn('w-4 h-4', config.color)} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{activity.original_prompt}</p>
                  <Badge
                    variant={
                      riskLevel === 'high' ? 'risk_high' :
                        riskLevel === 'medium' ? 'risk_medium' : 'risk_low'
                    }
                  >
                    {riskLevel.toUpperCase()}
                  </Badge>
                </div>
                {activity.risk_assessment?.flags?.length > 0 ? (
                  <p className="text-sm text-destructive mt-0.5">
                    {activity.risk_assessment.flags.join(", ")}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {activity.generated_content ? "Response generated successfully" : "Processing..."}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>

                {needsReview && activity.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleReview(activity.id!, 'APPROVE', e)}
                      className="p-1 hover:bg-success/20 rounded text-success transition-colors"
                      title="Approve"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => handleReview(activity.id!, 'REJECT', e)}
                      className="p-1 hover:bg-destructive/20 rounded text-destructive transition-colors"
                      title="Reject"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
