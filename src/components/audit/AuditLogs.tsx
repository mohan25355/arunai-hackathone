import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronRight,
  Shield,
  MessageSquare,
  UserCheck,
  AlertTriangle,
  Settings,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { AuditLogEntry, RiskLevel } from '@/types/governance';

const mockLogs: AuditLogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    action: 'PROMPT_PROCESSED',
    actor: 'system',
    resourceType: 'prompt',
    resourceId: 'pmt_12345',
    details: { model: 'gemini-2.5-flash', confidence: 87 },
    riskLevel: 'low',
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1000 * 60 * 8),
    action: 'REVIEW_REQUIRED',
    actor: 'governance_engine',
    resourceType: 'response',
    resourceId: 'rsp_67890',
    details: { reason: 'sensitive_domain', domain: 'medical' },
    riskLevel: 'high',
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    action: 'RESPONSE_APPROVED',
    actor: 'admin@company.com',
    resourceType: 'response',
    resourceId: 'rsp_54321',
    details: { notes: 'Verified against source documents' },
    riskLevel: 'low',
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    action: 'POLICY_VIOLATION',
    actor: 'governance_engine',
    resourceType: 'prompt',
    resourceId: 'pmt_11111',
    details: { policy: 'content_safety', severity: 'critical' },
    riskLevel: 'high',
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    action: 'POLICY_UPDATED',
    actor: 'admin@company.com',
    resourceType: 'policy',
    resourceId: 'pol_99999',
    details: { version: '2.3.1', changes: ['Added healthcare restrictions'] },
    riskLevel: 'medium',
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    action: 'BIAS_DETECTED',
    actor: 'bias_engine',
    resourceType: 'response',
    resourceId: 'rsp_22222',
    details: { biasType: 'gender', score: 45, threshold: 30 },
    riskLevel: 'medium',
  },
];

const actionConfig: Record<string, { icon: typeof Shield; color: string; bg: string }> = {
  PROMPT_PROCESSED: { icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10' },
  REVIEW_REQUIRED: { icon: UserCheck, color: 'text-warning', bg: 'bg-warning/10' },
  RESPONSE_APPROVED: { icon: Shield, color: 'text-success', bg: 'bg-success/10' },
  POLICY_VIOLATION: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  POLICY_UPDATED: { icon: Settings, color: 'text-info', bg: 'bg-info/10' },
  BIAS_DETECTED: { icon: FileText, color: 'text-warning', bg: 'bg-warning/10' },
};

export function AuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">Complete traceability of all governance actions</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by action, actor, or resource..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Log List */}
      <div className="flex-1 glass-card overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr] h-full">
          {/* Log Items */}
          <div className="border-r border-border overflow-y-auto scrollbar-thin">
            {mockLogs.map((log) => {
              const config = actionConfig[log.action] || actionConfig.PROMPT_PROCESSED;
              const Icon = config.icon;
              
              return (
                <button
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 border-b border-border hover:bg-secondary/50 transition-colors text-left',
                    selectedLog?.id === log.id && 'bg-primary/5 border-l-2 border-l-primary'
                  )}
                >
                  <div className={cn('p-2 rounded-lg shrink-0', config.bg)}>
                    <Icon className={cn('w-4 h-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {log.action.replace(/_/g, ' ')}
                      </p>
                      <Badge variant={`risk_${log.riskLevel}` as any} className="text-[10px]">
                        {log.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {log.actor}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(log.timestamp)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Log Details */}
          <div className="p-6 overflow-y-auto scrollbar-thin">
            {selectedLog ? (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedLog.action.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedLog.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={`risk_${selectedLog.riskLevel}` as any}>
                    {selectedLog.riskLevel} risk
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Actor</p>
                    <p className="font-mono text-sm">{selectedLog.actor}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Resource Type</p>
                    <p className="font-mono text-sm">{selectedLog.resourceType}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Resource ID</p>
                    <p className="font-mono text-sm text-primary">{selectedLog.resourceId}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-3">Event Details</p>
                  <div className="p-4 rounded-lg bg-secondary/50 font-mono text-sm">
                    <pre className="whitespace-pre-wrap text-muted-foreground">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Log ID: <span className="font-mono text-primary">{selectedLog.id}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This record is immutable and stored in the audit database.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Select a Log Entry</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Click on any log entry to view its complete details and metadata.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
