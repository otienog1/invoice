'use client';

import Link from 'next/link';
import { Eye, Send, Download, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Invoice } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { invoicesApi } from '@/lib/api';

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  onRefresh: () => void;
}

export function InvoiceTable({ invoices, loading, onRefresh }: InvoiceTableProps) {
  const handleSendInvoice = async (invoiceId: number) => {
    try {
      await invoicesApi.sendInvoice(invoiceId);
      onRefresh();
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  const handleDownloadPDF = async (invoiceId: number, invoiceNumber: string) => {
    try {
      const blob = await invoicesApi.downloadPDF(invoiceId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-4 border-b">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-6 bg-gray-300 rounded w-16"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first invoice for a customer.
          </p>
          <Link
            href="/invoices/create"
            className="btn btn-primary"
          >
            Create Invoice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.invoice_number}
                    </div>
                    {invoice.title && (
                      <div className="text-sm text-gray-500">{invoice.title}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {invoice.customer?.name}
                  </div>
                  {invoice.customer?.company && (
                    <div className="text-sm text-gray-500">{invoice.customer.company}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(invoice.issue_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.total_amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Invoice"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    
                    <Link
                      href={`/invoices/${invoice.id}/edit`}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Edit Invoice"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    
                    {invoice.status === 'draft' && (
                      <button
                        onClick={() => handleSendInvoice(invoice.id)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Send Invoice"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDownloadPDF(invoice.id, invoice.invoice_number)}
                      className="text-gray-400 hover:text-purple-600 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}