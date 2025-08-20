'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Server, 
  Database, 
  Zap, 
  HardDrive,
  Activity
} from 'lucide-react';

export function SystemStatusCard() {
  const statusItems = [
    {
      label: 'Server Status',
      status: 'Online',
      icon: Server,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      statusColor: 'bg-green-500'
    },
    {
      label: 'Database',
      status: 'Healthy',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      statusColor: 'bg-green-500'
    },
    {
      label: 'API Response',
      status: 'Fast',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      statusColor: 'bg-green-500'
    },
    {
      label: 'Storage',
      status: '85% Used',
      icon: HardDrive,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      statusColor: 'bg-yellow-500'
    }
  ];

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {statusItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <Icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${item.statusColor}`} />
                  <span className="text-xs text-muted-foreground">
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated</span>
            <span>2 min ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}