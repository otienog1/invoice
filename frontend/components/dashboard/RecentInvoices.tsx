'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Send, Download } from 'lucide-react';
import { invoicesApi } from '@/lib/api';
import { Invoice } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

export function RecentInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentInvoices();
  }, []);

  const fetchRecentInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoicesApi.getInvoices({
        per_page: 5,
        user_id: 1, // TODO: Get from auth context
      });
      setInvoices(response.items || []);
    } catch (error) {
      console.error('Error fetching recent invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Invoices</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Recent Invoices</h3>
        <Link
          href="/invoices"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all
        </Link>
      </div>
      
      {invoices.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No invoices found</p>
          <Link
            href="/invoices/create"
            className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-700"
          >
            Create your first invoice
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {invoice.customer?.name} • {formatDate(invoice.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.total_amount)}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                        invoice.status
                      )}`}
                    >
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Invoice"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    
                    {invoice.status === 'draft' && (
                      <button
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Send Invoice"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}