import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Edit2, 
  AlertTriangle,
  Clock,
  ChevronRight,
  MessageSquare,
  Brain,
  FileSearch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ReviewItem {
  id: string;
  prompt: string;
  response: string;
  riskLevel: 'low' | 'medium' | 'high';
  reason: string;
  timestamp: Date;
  confidenceScore: number;
  sources: number;
}

const mockReviewQueue: ReviewItem[] = [
  {
    id: '1',
    prompt: 'What are the side effects of combining aspirin with blood thinners?',
    response: 'Combining aspirin with blood thinners can increase the risk of bleeding complications. Based on our medical knowledge base, the primary concerns include...',
    riskLevel: 'high',
    reason: 'Medical domain - requires expert verification',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    confidenceScore: 72,
    sources: 4,
  },
  {
    id: '2',
    prompt: 'Can you explain our company investment strategy for 2024?',
    response: 'Our 2024 investment strategy focuses on sustainable growth with a balanced portfolio approach. Key allocations include...',
    riskLevel: 'high',
    reason: 'Financial advice - regulatory compliance required',
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    confidenceScore: 68,
    sources: 2,
  },
  {
    id: '3',
    prompt: 'What is the refund policy for enterprise customers?',
    response: 'Enterprise customers are eligible for full refunds within the first 30 days of service. After this period, pro-rated refunds are available...',
    riskLevel: 'medium',
    reason: 'Policy statement - verification recommended',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    confidenceScore: 85,
    sources: 3,
  },
];

export function HumanReview() {
  const [queue, setQueue] = useState(mockReviewQueue);
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(mockReviewQueue[0]);
  const [reviewNotes, setReviewNotes] = useState('');

  const handleApprove = (id: string) => {
    setQueue(queue.filter(item => item.id !== id));
    setSelectedItem(null);
    toast.success('Response approved and released');
  };

  const handleReject = (id: string) => {
    setQueue(queue.filter(item => item.id !== id));
    setSelectedItem(null);
    toast.error('Response rejected');
  };

  const formatTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="h-full flex flex-col p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Human Review Queue</h1>
          <p className="text-muted-foreground">Responses requiring human oversight before release</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="px-3 py-1">
            <Clock className="w-3 h-3 mr-1" />
            {queue.length} pending
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-[400px_1fr] gap-6 min-h-0">
        {/* Queue List */}
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">Review Queue</h3>
          </div>
          <div className="overflow-y-auto scrollbar-thin h-[calc(100%-57px)]">
            {queue.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <CheckCircle className="w-12 h-12 text-success mb-4" />
                <h3 className="font-medium">Queue Empty</h3>
                <p className="text-sm text-muted-foreground">All items have been reviewed</p>
              </div>
            ) : (
              queue.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    'w-full flex items-start gap-3 p-4 border-b border-border hover:bg-secondary/50 transition-colors text-left',
                    selectedItem?.id === item.id && 'bg-primary/5 border-l-2 border-l-primary'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg shrink-0',
                    item.riskLevel === 'high' ? 'bg-destructive/10' : 'bg-warning/10'
                  )}>
                    <AlertTriangle className={cn(
                      'w-4 h-4',
                      item.riskLevel === 'high' ? 'text-destructive' : 'text-warning'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.prompt}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={`risk_${item.riskLevel}` as any} className="text-[10px]">
                        {item.riskLevel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Review Panel */}
        {selectedItem ? (
          <div className="glass-card overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Badge variant={`risk_${selectedItem.riskLevel}` as any}>
                  {selectedItem.riskLevel} risk
                </Badge>
                <span className="text-sm text-muted-foreground">{selectedItem.reason}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm" onClick={() => handleReject(selectedItem.id)}>
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button variant="success" size="sm" onClick={() => handleApprove(selectedItem.id)}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
              {/* Original Prompt */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold">Original Prompt</h4>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-sm">{selectedItem.prompt}</p>
                </div>
              </div>

              {/* Generated Response */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold">Generated Response</h4>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-sm whitespace-pre-wrap">{selectedItem.response}</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-primary">{selectedItem.confidenceScore}%</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Sources</p>
                  <p className="text-2xl font-bold">{selectedItem.sources}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Wait Time</p>
                  <p className="text-2xl font-bold">{formatTime(selectedItem.timestamp)}</p>
                </div>
              </div>

              {/* Review Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">Review Notes (Optional)</label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes for audit trail..."
                  className="w-full h-24 p-3 rounded-lg bg-secondary border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Items Selected</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Select an item from the queue to begin your review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
