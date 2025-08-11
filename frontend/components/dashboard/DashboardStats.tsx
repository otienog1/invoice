'use client';

import { useEffect, useState } from 'react';
import { DollarSign, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { invoicesApi } from '@/lib/api';
import { DashboardStats as StatsType } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function DashboardStats() {
  const [stats, setStats] = useState<StatsType>({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
    paidInvoices: 0,
    overdueInvoices: 0,
    monthlyRevenue: 0,
    recentInvoices: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await invoicesApi.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%',
      changeType: 'positive',
    },
    {
      name: 'Total Invoices',
      value: stats.totalInvoices.toString(),
      icon: FileText,
      color: 'bg-blue-500',
      change: '+3',
      changeType: 'positive',
    },
    {
      name: 'Pending',
      value: stats.pendingInvoices.toString(),
      icon: Clock,
      color: 'bg-yellow-500',
      change: stats.pendingInvoices > stats.paidInvoices ? '+2' : '-1',
      changeType: stats.pendingInvoices > stats.paidInvoices ? 'negative' : 'positive',
    },
    {
      name: 'Paid',
      value: stats.paidInvoices.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+5',
      changeType: 'positive',
    },
    {
      name: 'Overdue',
      value: stats.overdueInvoices.toString(),
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: stats.overdueInvoices > 0 ? `+${stats.overdueInvoices}` : '0',
      changeType: stats.overdueInvoices > 0 ? 'negative' : 'neutral',
    },
    {
      name: 'This Month',
      value: formatCurrency(stats.monthlyRevenue),
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+8.2%',
      changeType: 'positive',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center">
              <div className="bg-gray-300 p-3 rounded-lg w-12 h-12"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <span
                  className={`ml-2 text-xs font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : stat.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}