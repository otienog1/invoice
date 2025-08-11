'use client';

import { useState } from 'react';
import { 
  Download, 
  Send, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  Calendar,
  User,
  Building,
  Mail,
  Phone 
} from 'lucide-react';
import { Invoice } from '@/types';
import { formatCurrency, formatDate, getStatusColor, copyToClipboard } from '@/lib/utils';
import { invoicesApi } from '@/lib/api';

interface InvoiceDetailProps {
  invoice: Invoice;
  onUpdate: (invoice: Invoice) => void;
}

export function InvoiceDetail({ invoice, onUpdate }: InvoiceDetailProps) {
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSendInvoice = async () => {
    try {
      setLoading(true);
      await invoicesApi.sendInvoice(invoice.id);
      const updatedInvoice = { ...invoice, status: 'sent' as const };
      onUpdate(updatedInvoice);
    } catch (error) {
      console.error('Error sending invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setLoading(true);
      const blob = await invoicesApi.downloadPDF(invoice.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInvoiceNumber = async () => {
    try {
      await copyToClipboard(invoice.invoice_number);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {invoice.invoice_number}
              </h1>
              <button
                onClick={handleCopyInvoiceNumber}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy invoice number"
              >
                <Copy className="h-4 w-4" />
              </button>
              {copySuccess && (
                <span className="text-sm text-green-600">Copied!</span>
              )}
            </div>
            {invoice.title && (
              <p className="text-lg text-gray-600 mt-1">{invoice.title}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                invoice.status
              )}`}
            >
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
            
            <div className="flex items-center space-x-2">
              {invoice.status === 'draft' && (
                <button
                  onClick={handleSendInvoice}
                  disabled={loading}
                  className="btn btn-primary flex items-center space-x-1"
                >
                  <Send className="h-4 w-4" />
                  <span>{loading ? 'Sending...' : 'Send'}</span>
                </button>
              )}
              
              <button
                onClick={handleDownloadPDF}
                disabled={loading}
                className="btn btn-secondary flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>PDF</span>
              </button>
              
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Bill To
              </h3>
            </div>
            <div className="card-body">
              {invoice.customer ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {invoice.customer.name}
                    </span>
                  </div>
                  
                  {invoice.customer.company && (
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{invoice.customer.company}</span>
                    </div>
                  )}
                  
                  {invoice.customer.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{invoice.customer.email}</span>
                    </div>
                  )}
                  
                  {invoice.customer.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{invoice.customer.phone}</span>
                    </div>
                  )}
                  
                  {invoice.customer.address && (
                    <div className="mt-3 text-gray-600 text-sm">
                      {invoice.customer.address}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No customer information available</p>
              )}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Items</h3>
            </div>
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        Qty
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Rate
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 text-right">
                          {formatCurrency(item.rate)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                          {formatCurrency(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(invoice.notes || invoice.terms) && (
            <div className="card">
              <div className="card-body space-y-4">
                {invoice.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-gray-600 text-sm">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Terms & Conditions</h4>
                    <p className="text-gray-600 text-sm">{invoice.terms}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-medium text-gray-900">Summary</h3>
            </div>
            <div className="card-body space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Issue Date:</span>
                <span className="font-medium">{formatDate(invoice.issue_date)}</span>
              </div>
              
              {invoice.due_date && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium">{formatDate(invoice.due_date)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Amount Breakdown */}
          <div className="card">
            <div className="card-body space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Discount ({invoice.discount_rate}%):</span>
                  <span>-{formatCurrency(invoice.discount_amount)}</span>
                </div>
              )}
              
              {invoice.tax_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax ({invoice.tax_rate}%):</span>
                  <span className="font-medium">{formatCurrency(invoice.tax_amount)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(invoice.total_amount)}</span>
                </div>
              </div>
              
              {invoice.paid_amount > 0 && (
                <>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Paid:</span>
                    <span>-{formatCurrency(invoice.paid_amount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-red-600">
                    <span>Balance Due:</span>
                    <span>{formatCurrency(invoice.total_amount - invoice.paid_amount)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}