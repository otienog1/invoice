'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  User,
  Download,
  Settings,
  UserPlus,
  FileText,
  Mail
} from 'lucide-react';

export function RecentActivityCard() {
  const activities = [
    {
      id: 1,
      type: 'user_login',
      description: 'User login',
      user: 'john@example.com',
      timestamp: '2 min ago',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 2,
      type: 'data_export',
      description: 'Data export',
      user: 'admin',
      timestamp: '5 min ago',
      icon: Download,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'settings_update',
      description: 'Settings updated',
      user: 'admin',
      timestamp: '10 min ago',
      icon: Settings,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 4,
      type: 'new_user',
      description: 'New user registered',
      user: 'sarah@example.com',
      timestamp: '15 min ago',
      icon: UserPlus,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 5,
      type: 'invoice_created',
      description: 'Invoice created',
      user: 'mike@example.com',
      timestamp: '25 min ago',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 6,
      type: 'email_sent',
      description: 'Invoice email sent',
      user: 'system',
      timestamp: '30 min ago',
      icon: Mail,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'user_login':
        return <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">Login</Badge>;
      case 'data_export':
        return <Badge variant="outline" className="text-xs text-green-600 border-green-200">Export</Badge>;
      case 'settings_update':
        return <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">Update</Badge>;
      case 'new_user':
        return <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">New</Badge>;
      case 'invoice_created':
        return <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">Create</Badge>;
      case 'email_sent':
        return <Badge variant="outline" className="text-xs text-green-600 border-green-200">Email</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Activity</Badge>;
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-2 rounded-lg hover:bg-background/50 transition-colors"
              >
                <div className={`p-1.5 rounded-lg ${activity.bgColor} mt-0.5`}>
                  <Icon className={`h-3 w-3 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getActivityBadge(activity.type)}
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.user}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="link" className="text-xs w-full text-center p-0 h-auto">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}