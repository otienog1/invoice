'use client';

import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const publicRoutes = ['/login', '/register'];
const orgSelectionRoutes = ['/organization-select', '/create-organization', '/join-organization'];

export const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, tenant, isLoading } = useAuth();
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);
  const isOrgSelectionRoute = orgSelectionRoutes.includes(pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Public routes (login, register) - show without sidebar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Organization selection routes - show without sidebar if authenticated
  if (isOrgSelectionRoute && user) {
    return <>{children}</>;
  }

  // Protected routes - redirect to login if not authenticated
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // If user is authenticated but no tenant selected, redirect to organization selection
  if (user && !tenant) {
    if (typeof window !== 'undefined') {
      window.location.href = '/organization-select';
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Authenticated routes - show with sidebar
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};