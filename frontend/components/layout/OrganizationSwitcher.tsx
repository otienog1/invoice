'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Building2, ChevronDown, Check, Plus, Settings } from 'lucide-react';
import { Tenant } from '@/types';
import Link from 'next/link';

export const OrganizationSwitcher: React.FC = () => {
  const { tenant, switchTenant, getUserTenants } = useAuth();
  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tenant) {
      fetchAvailableTenants();
    }
  }, [tenant]);

  const fetchAvailableTenants = async () => {
    try {
      const tenants = await getUserTenants();
      setAvailableTenants(tenants);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const handleTenantSwitch = async (tenantId: number) => {
    if (tenantId === tenant?.id) return;
    
    try {
      setIsLoading(true);
      await switchTenant(tenantId);
    } catch (error) {
      console.error('Error switching tenant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-700';
      case 'basic': return 'bg-blue-100 text-blue-700';
      case 'professional': return 'bg-purple-100 text-purple-700';
      case 'enterprise': return 'bg-gold-100 text-gold-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!tenant) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between h-auto p-3 hover:bg-gray-50"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-1.5 bg-blue-100 rounded-md flex-shrink-0">
              <Building2 className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-left min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {tenant.name}
              </p>
              <div className="flex items-center space-x-2">
                <Badge 
                  className={`text-xs px-1.5 py-0.5 ${getPlanColor(tenant.plan)}`}
                >
                  {tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="start">
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Your Organizations
          </p>
        </div>

        {availableTenants.map((t) => (
          <DropdownMenuItem
            key={t.id}
            className="p-2 cursor-pointer"
            onClick={() => handleTenantSwitch(t.id)}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="p-1.5 bg-blue-100 rounded-md">
                <Building2 className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {t.name}
                  </p>
                  {t.id === tenant.id && (
                    <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs px-1.5 py-0.5 ${getPlanColor(t.plan)}`}>
                    {t.plan}
                  </Badge>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    t.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {t.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/organization-settings" className="flex items-center space-x-2 p-2 w-full">
            <Settings className="h-4 w-4" />
            <span>Organization Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/create-organization" className="flex items-center space-x-2 p-2 w-full">
            <Plus className="h-4 w-4" />
            <span>Create Organization</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/organization-select" className="flex items-center space-x-2 p-2 w-full">
            <Building2 className="h-4 w-4" />
            <span>All Organizations</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};