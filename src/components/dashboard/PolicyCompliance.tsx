import { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PolicyStat {
  name: string;
  compliance: number;
  status: 'compliant' | 'warning' | 'violation';
}

const statusStyles = {
  compliant: 'bg-success',
  warning: 'bg-warning',
  violation: 'bg-destructive',
};

export function PolicyCompliance() {
  const [stats, setStats] = useState<PolicyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8000/policy-stats');
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Poll every 10s to match dashboard
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Policy Compliance</h3>
        <Shield className="w-5 h-5 text-primary" />
      </div>

      {loading && stats.length === 0 ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-8 bg-secondary/50 rounded" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {stats.map((policy) => (
            <div key={policy.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{policy.name}</span>
                <span className={cn(
                  'text-sm font-semibold',
                  policy.status === 'compliant' && 'text-success',
                  policy.status === 'warning' && 'text-warning',
                  policy.status === 'violation' && 'text-destructive'
                )}>
                  {policy.compliance}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    statusStyles[policy.status]
                  )}
                  style={{ width: `${policy.compliance}%` }}
                />
              </div>
            </div>
          ))}
          {stats.length === 0 && <p className="text-sm text-muted-foreground text-center">No policies active.</p>}
        </div>
      )}
    </div>
  );
}
