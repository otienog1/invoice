'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Download, 
  Settings, 
  Users,
  FileText,
  Mail
} from 'lucide-react';

interface QuickActionsCardProps {
  onAddInvoice?: () => void;
  onAddCustomer?: () => void;
  onExport?: () => void;
}

export function QuickActionsCard({ 
  onAddInvoice, 
  onAddCustomer, 
  onExport 
}: QuickActionsCardProps) {
  const actions = [
    {
      label: 'Add New Invoice',
      icon: FileText,
      onClick: onAddInvoice,
      shortcut: 'Ctrl+I',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      label: 'Add Customer',
      icon: Users,
      onClick: onAddCustomer,
      shortcut: 'Ctrl+U',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      label: 'Export Data',
      icon: Download,
      onClick: onExport,
      shortcut: 'Ctrl+E',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      label: 'Send Reminders',
      icon: Mail,
      onClick: () => console.log('Send reminders'),
      shortcut: 'Ctrl+R',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    }
  ];

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="ghost"
                onClick={action.onClick}
                className={`w-full justify-start h-auto p-3 ${action.bgColor} border border-transparent hover:border-border/50`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <Icon className={`h-4 w-4 ${action.color}`} />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {action.label}
                    </p>
                  </div>
                  <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    {action.shortcut}
                  </kbd>
                </div>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}