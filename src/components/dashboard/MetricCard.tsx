import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'primary';
}

const variantStyles = {
  default: {
    iconBg: 'bg-secondary',
    iconColor: 'text-foreground',
    valueBg: '',
  },
  success: {
    iconBg: 'bg-success/15',
    iconColor: 'text-success',
    valueBg: 'text-success',
  },
  warning: {
    iconBg: 'bg-warning/15',
    iconColor: 'text-warning',
    valueBg: 'text-warning',
  },
  destructive: {
    iconBg: 'bg-destructive/15',
    iconColor: 'text-destructive',
    valueBg: 'text-destructive',
  },
  primary: {
    iconBg: 'bg-primary/15',
    iconColor: 'text-primary',
    valueBg: 'text-primary',
  },
};

export function MetricCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <div className="glass-card p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className={cn('flex items-center justify-center w-11 h-11 rounded-xl', styles.iconBg)}>
          <Icon className={cn('w-5 h-5', styles.iconColor)} />
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium',
            trend.isPositive ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
          )}>
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="metric-label">{title}</p>
        <p className={cn('metric-value mt-1', styles.valueBg)}>{value}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
