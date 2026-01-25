import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

export function KpiCard({ title, value, change, trend, icon }: KpiCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-soft hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
        <div
          className={cn(
            'flex items-center gap-0.5 text-sm font-medium',
            trend === 'up' ? 'text-success' : 'text-destructive'
          )}
        >
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
      </div>
    </div>
  );
}
