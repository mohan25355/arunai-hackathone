import {
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Brain,
  Target,
  Activity,
  RefreshCw
} from 'lucide-react';
import { MetricCard } from './MetricCard';
import { RiskGauge } from './RiskGauge';
import { RecentActivity } from './RecentActivity';
import { PolicyCompliance } from './PolicyCompliance';
import { useDashboardData } from '@/hooks/useDashboardData';

export function Dashboard() {
  const { metrics, activities, loading, error, refresh } = useDashboardData();

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Safety net
  const safe = (v: number | undefined | null) => Number.isFinite(v) ? v! : 0;

  // Fallback if null (should handle in hook but being safe)
  const safeMetrics = metrics || {
    total_prompts: 0,
    approved_responses: 0,
    pending_review: 0,
    policy_violations: 0,
    trust_scores: {
      overall_trust: 0,
      bias_risk: 0
    },
    hallucination: {
      grounded: 0,
      avg_confidence: 0,
      hallucination_rate: 0
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Governance Dashboard</h1>
          <p className="text-muted-foreground">Real-time AI governance metrics and oversight</p>
        </div>
        <div className="flex items-center gap-4">
          {error && <span className="text-destructive text-sm font-medium">{error}</span>}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
            <Activity className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">Live Monitoring</span>
          </div>
          <button
            onClick={refresh}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Prompts"
          value={safe(safeMetrics.total_prompts)}
          subtitle="All time"
          icon={MessageSquare}
          variant="primary"
        />
        <MetricCard
          title="Approved Responses"
          value={safe(safeMetrics.approved_responses)}
          subtitle={`${safe(safeMetrics.total_prompts) ? Math.round((safe(safeMetrics.approved_responses) / safe(safeMetrics.total_prompts)) * 100) : 0}% approval rate`}
          icon={CheckCircle}
          variant="success"
        />
        <MetricCard
          title="Pending Review"
          value={safe(safeMetrics.pending_review)}
          subtitle="Requires human oversight"
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title="Policy Violations"
          value={safe(safeMetrics.policy_violations)}
          subtitle="Blocked by governance"
          icon={AlertTriangle}
          variant="destructive"
        />
      </div>

      {/* Risk Gauges & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6">Trust Scores</h3>
          <div className="flex items-center justify-around">
            <RiskGauge score={Math.round(safe(safeMetrics.trust_scores?.overall_trust))} level="low" label="Overall Trust" />
            <RiskGauge score={Math.round(safe(safeMetrics.trust_scores?.bias_risk))} level={safe(safeMetrics.trust_scores?.bias_risk) > 50 ? "high" : "low"} label="Bias Risk" />
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-6">Hallucination Detection</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/30">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-success" />
                <span className="font-medium">Grounded Responses</span>
              </div>
              <span className="text-xl font-bold text-success">{Math.round(safe(safeMetrics.hallucination?.grounded))}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/30">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-warning" />
                <span className="font-medium">Avg Confidence</span>
              </div>
              <span className="text-xl font-bold text-warning">{safe(safeMetrics.hallucination?.avg_confidence)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <span className="font-medium">Hallucination Rate</span>
              </div>
              <span className="text-xl font-bold text-destructive">{safe(safeMetrics.hallucination?.hallucination_rate)}%</span>
            </div>
          </div>
        </div>

        <PolicyCompliance />
      </div>

      {/* Activity Feed */}
      <RecentActivity data={activities} />
    </div>
  );
}
