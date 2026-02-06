import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types/governance';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskGauge({ score, level, label, size = 'md' }: RiskGaugeProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const levelColors = {
    low: { stroke: 'stroke-success', text: 'text-success', bg: 'bg-success/10' },
    medium: { stroke: 'stroke-warning', text: 'text-warning', bg: 'bg-warning/10' },
    high: { stroke: 'stroke-destructive', text: 'text-destructive', bg: 'bg-destructive/10' },
  };

  const sizeStyles = {
    sm: { container: 'w-24 h-24', text: 'text-xl', label: 'text-[10px]' },
    md: { container: 'w-32 h-32', text: 'text-2xl', label: 'text-xs' },
    lg: { container: 'w-40 h-40', text: 'text-3xl', label: 'text-sm' },
  };

  const colors = levelColors[level];
  const styles = sizeStyles[size];

  return (
    <div className="flex flex-col items-center">
      <div className={cn('relative', styles.container)}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            className="stroke-secondary"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            className={cn(colors.stroke, 'transition-all duration-1000 ease-out')}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('font-bold', styles.text, colors.text)}>
            {score}%
          </span>
          <span className={cn(
            'mt-0.5 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider',
            styles.label,
            colors.bg,
            colors.text
          )}>
            {level}
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
