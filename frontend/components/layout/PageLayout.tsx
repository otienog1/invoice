'use client';

import { ReactNode } from 'react';
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
  Bell,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  backUrl?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  isRefreshing?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
  headerActions?: ReactNode;
}

export function PageLayout({
  children,
  title,
  subtitle,
  breadcrumb,
  backUrl,
  searchQuery = '',
  onSearchChange,
  onRefresh,
  onExport,
  isRefreshing = false,
  showSearch = true,
  showActions = true,
  headerActions
}: PageLayoutProps) {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 border-b bg-background/50 backdrop-blur">
        {/* Top Row - Breadcrumb and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {backUrl && (
              <Link
                href={backUrl}
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            )}
            {breadcrumb && (
              <Badge variant="outline" className="text-xs">
                {breadcrumb}
              </Badge>
            )}
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-2">
              {/* Search */}
              {showSearch && (
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="pl-9 w-64 bg-background/50"
                  />
                </div>
              )}

              {/* Filter Button */}
              <Button variant="outline" size="sm" className="bg-background/50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>

              {/* Export Button */}
              {onExport && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onExport}
                  className="bg-background/50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}

              {/* Refresh Button */}
              {onRefresh && (
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
              )}

              {/* Custom Header Actions */}
              {headerActions}

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
                  <DropdownMenuItem>View Analytics</DropdownMenuItem>
                  <DropdownMenuItem>Generate Report</DropdownMenuItem>
                  <DropdownMenuItem>Export Data</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Search */}
        {showSearch && showActions && (
          <div className="relative sm:hidden">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9 bg-background/50"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-2 pt-0 sm:gap-4 sm:p-4">
        <div className="min-h-[calc(100vh-4rem)] flex-1 rounded-lg p-3 sm:rounded-xl sm:p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6">
            {/* Page Title */}
            <div className="px-2 sm:px-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground text-sm sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Page Content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}