'use client';

import Link from 'next/link';
import { Plus, Users, FileText, Send, BarChart3, Settings } from 'lucide-react';

const quickActions = [
  {
    name: 'Create Invoice',
    description: 'Generate a new invoice for your customer',
    href: '/invoices/create',
    icon: Plus,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    name: 'Add Customer',
    description: 'Add a new customer to your database',
    href: '/customers',
    icon: Users,
    color: 'bg-green-50 text-green-700 border-green-200',
  },
  {
    name: 'View Reports',
    description: 'Check your revenue and invoice analytics',
    href: '/reports',
    icon: BarChart3,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    name: 'Settings',
    description: 'Update your company and account settings',
    href: '/settings',
    icon: Settings,
    color: 'bg-gray-50 text-gray-700 border-gray-200',
  },
];

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <p className="text-sm text-gray-500 mt-1">Common tasks and shortcuts</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.href}
              className={`block p-4 rounded-lg border transition-all hover:shadow-md ${action.color}`}
            >
              <div className="flex items-start space-x-3">
                <action.icon className="h-6 w-6 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{action.name}</p>
                  <p className="text-sm opacity-75 mt-1">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="border-t border-gray-200">
        <div className="px-6 py-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Invoice #INV-2024-001 was paid</span>
              <span className="text-gray-400">2h ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">New customer "Acme Corp" added</span>
              <span className="text-gray-400">1d ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Invoice #INV-2024-002 sent</span>
              <span className="text-gray-400">2d ago</span>
            </div>
          </div>
          
          <Link
            href="/activity"
            className="inline-block text-sm text-blue-600 hover:text-blue-700 mt-3"
          >
            View all activity
          </Link>
        </div>
      </div>
    </div>
  );
}