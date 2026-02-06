import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Shield, 
  ToggleLeft, 
  ToggleRight,
  Edit,
  Trash2,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Policy, PolicyRule } from '@/types/governance';

const mockPolicies: Policy[] = [
  {
    id: '1',
    name: 'Content Safety Policy',
    description: 'Prevents generation of harmful, offensive, or inappropriate content',
    rules: [
      { id: 'r1', type: 'block', condition: 'Contains hate speech or slurs', message: 'Content violates hate speech policy' },
      { id: 'r2', type: 'block', condition: 'Promotes violence or self-harm', message: 'Content promotes harmful actions' },
      { id: 'r3', type: 'warn', condition: 'Contains potentially sensitive topics', message: 'Content may be sensitive' },
    ],
    version: '2.1.0',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    name: 'Medical Information Policy',
    description: 'Ensures medical advice is properly disclaimed and sourced',
    rules: [
      { id: 'r4', type: 'require_review', condition: 'Provides medical diagnosis or treatment', message: 'Medical content requires expert review' },
      { id: 'r5', type: 'warn', condition: 'Discusses medications or dosages', message: 'Medical information should be verified' },
    ],
    version: '1.3.0',
    isActive: true,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: '3',
    name: 'Financial Compliance Policy',
    description: 'Regulatory compliance for financial advice and information',
    rules: [
      { id: 'r6', type: 'require_review', condition: 'Provides investment recommendations', message: 'Financial advice requires compliance review' },
      { id: 'r7', type: 'block', condition: 'Makes specific return promises', message: 'Cannot guarantee investment returns' },
    ],
    version: '1.0.5',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '4',
    name: 'Data Privacy Policy',
    description: 'Protects personal and sensitive information in responses',
    rules: [
      { id: 'r8', type: 'block', condition: 'Contains PII without consent', message: 'Personal information exposure blocked' },
      { id: 'r9', type: 'warn', condition: 'References specific individuals', message: 'May contain identifiable information' },
    ],
    version: '3.0.0',
    isActive: true,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    name: 'Deprecated Test Policy',
    description: 'Old testing policy no longer in use',
    rules: [],
    version: '0.1.0',
    isActive: false,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2023-06-15'),
  },
];

const ruleTypeConfig = {
  block: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Block' },
  warn: { icon: Info, color: 'text-warning', bg: 'bg-warning/10', label: 'Warn' },
  require_review: { icon: CheckCircle, color: 'text-info', bg: 'bg-info/10', label: 'Require Review' },
};

export function PolicyManager() {
  const [policies, setPolicies] = useState(mockPolicies);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(mockPolicies[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const togglePolicy = (id: string) => {
    setPolicies(policies.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const activePolicies = policies.filter(p => p.isActive).length;

  return (
    <div className="h-full flex flex-col p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Policy Manager</h1>
          <p className="text-muted-foreground">Configure governance rules and ethical constraints</p>
        </div>
     
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Policies</p>
          <p className="text-2xl font-bold mt-1">{policies.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-success mt-1">{activePolicies}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Rules</p>
          <p className="text-2xl font-bold mt-1">
            {policies.reduce((acc, p) => acc + p.rules.length, 0)}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Block Rules</p>
          <p className="text-2xl font-bold text-destructive mt-1">
            {policies.reduce((acc, p) => acc + p.rules.filter(r => r.type === 'block').length, 0)}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-[400px_1fr] gap-6 min-h-0">
        {/* Policy List */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search policies..."
                className="w-full h-9 pl-10 pr-4 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="overflow-y-auto scrollbar-thin h-[calc(100%-73px)]">
            {policies.map((policy) => (
              <button
                key={policy.id}
                onClick={() => setSelectedPolicy(policy)}
                className={cn(
                  'w-full flex items-start gap-3 p-4 border-b border-border hover:bg-secondary/50 transition-colors text-left',
                  selectedPolicy?.id === policy.id && 'bg-primary/5 border-l-2 border-l-primary'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg shrink-0',
                  policy.isActive ? 'bg-primary/10' : 'bg-secondary'
                )}>
                  <Shield className={cn(
                    'w-4 h-4',
                    policy.isActive ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{policy.name}</p>
                    {!policy.isActive && (
                      <Badge variant="outline" className="text-[10px]">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {policy.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      v{policy.version}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {policy.rules.length} rules
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Policy Details */}
        {selectedPolicy ? (
          <div className="glass-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'p-2 rounded-lg',
                  selectedPolicy.isActive ? 'bg-primary/10' : 'bg-secondary'
                )}>
                  <Shield className={cn(
                    'w-5 h-5',
                    selectedPolicy.isActive ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedPolicy.name}</h3>
                  <p className="text-xs text-muted-foreground">Version {selectedPolicy.version}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4" />
                </Button>
                <button
                  onClick={() => togglePolicy(selectedPolicy.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {selectedPolicy.isActive ? (
                    <>
                      <ToggleRight className="w-5 h-5 text-success" />
                      <span className="text-sm text-success">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Inactive</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedPolicy.description}</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium">Rules ({selectedPolicy.rules.length})</h4>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Rule
                  </Button>
                </div>
                
                {selectedPolicy.rules.length === 0 ? (
                  <div className="p-8 text-center rounded-lg bg-secondary/50 border border-dashed border-border">
                    <p className="text-muted-foreground">No rules defined</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPolicy.rules.map((rule) => {
                      const config = ruleTypeConfig[rule.type];
                      const Icon = config.icon;
                      
                      return (
                        <div
                          key={rule.id}
                          className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn('p-2 rounded-lg', config.bg)}>
                              <Icon className={cn('w-4 h-4', config.color)} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-[10px]">
                                  {config.label}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium">{rule.condition}</p>
                              <p className="text-xs text-muted-foreground mt-1">{rule.message}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="shrink-0">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Created: {selectedPolicy.createdAt.toLocaleDateString()}</span>
                  <span>Updated: {selectedPolicy.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card flex flex-col items-center justify-center text-center p-8">
            <Shield className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a Policy</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Choose a policy from the list to view and edit its rules.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
