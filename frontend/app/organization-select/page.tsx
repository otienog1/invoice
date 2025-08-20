'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Plus, ChevronRight } from 'lucide-react';
import { Tenant } from '@/types';

export default function OrganizationSelectPage() {
  const router = useRouter();
  const { user, selectTenant, getUserTenants } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserTenants();
    }
  }, [user]);

  const fetchUserTenants = async () => {
    try {
      setLoading(true);
      const userTenants = await getUserTenants();
      setTenants(userTenants);
    } catch (error) {
      console.error('Error fetching user tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTenant = async (tenant: Tenant) => {
    try {
      await selectTenant(tenant.id);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error selecting tenant:', error);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'professional': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-gold-100 text-gold-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Select Organization</h1>
          <p className="mt-2 text-gray-600">
            Choose which organization you'd like to work with today
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <Card
              key={tenant.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-200"
              onClick={() => handleSelectTenant(tenant)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tenant.name}</CardTitle>
                      {tenant.domain && (
                        <CardDescription className="text-sm">
                          {tenant.domain}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getPlanColor(tenant.subscription_plan)}>
                      {tenant.subscription_plan.charAt(0).toUpperCase() + tenant.subscription_plan.slice(1)} Plan
                    </Badge>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      tenant.subscription_status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.subscription_status === 'active' ? 'Active' : tenant.subscription_status}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Multi-user workspace</span>
                  </div>

                  <div className="text-xs text-gray-500">
                    Joined {new Date(tenant.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Organization Card */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-300 bg-gray-50/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 text-center">
              <CardTitle className="text-lg mb-2">Create New Organization</CardTitle>
              <CardDescription>
                Start fresh with a new organization for your business
              </CardDescription>
              <Button 
                className="mt-4 w-full"
                onClick={() => router.push('/create-organization')}
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Need to join an existing organization?{' '}
            <Button 
              variant="link"
              className="text-blue-600 hover:underline p-0 h-auto"
              onClick={() => router.push('/join-organization')}
            >
              Join with invite code
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}