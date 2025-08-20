'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  MoreHorizontal,
  Bell
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface DashboardHeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({
  searchQuery = '',
  onSearchChange,
  onRefresh,
  onExport,
  isRefreshing = false
}: DashboardHeaderProps) {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-4 border-b bg-background/50 backdrop-blur">
      {/* Top Row - Breadcrumb and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            Home
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9 w-64 bg-background/50"
            />
          </div>

          {/* Filter Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-background/50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          {/* Export Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={onExport}
            className="bg-background/50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          {/* Refresh Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="bg-background/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="bg-background/50 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-background/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                View Analytics
              </DropdownMenuItem>
              <DropdownMenuItem>
                Generate Report
              </DropdownMenuItem>
              <DropdownMenuItem>
                System Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="relative sm:hidden">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-9 bg-background/50"
        />
      </div>
    </div>
  );
}