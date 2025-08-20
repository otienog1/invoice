'use client';

import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  stat: {
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
    icon: LucideIcon;
    color: string;
    bgColor: string;
  };
  index: number;
}

export function DashboardCard({ stat, index }: DashboardCardProps) {
  const Icon = stat.icon;
  
  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <div className={cn("p-2 rounded-lg", stat.bgColor)}>
            <Icon className={cn("h-4 w-4 sm:h-5 sm:w-5", stat.color)} />
          </div>
          <div className={cn(
            "text-xs sm:text-sm font-medium",
            stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
          )}>
            {stat.change}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight">
            {stat.value}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {stat.title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}