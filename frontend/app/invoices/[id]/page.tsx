'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { InvoiceDetail } from '@/components/invoice/InvoiceDetail';
import { invoicesApi } from '@/lib/api';
import { Invoice } from '@/types';

interface InvoicePageProps {
  params: {
    id: string;
  };
}

export default function InvoicePage({ params }: InvoicePageProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchInvoice();
    }
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const invoiceId = parseInt(params.id);
      const data = await invoicesApi.getInvoice(invoiceId);
      setInvoice(data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError('Failed to load invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceUpdate = (updatedInvoice: Invoice) => {
    setInvoice(updatedInvoice);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/invoices"
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="h-8 bg-gray-300 rounded animate-pulse w-48"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-32 mt-2"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow animate-pulse">
          <div className="p-6 border-b border-gray-200">
            <div className="h-8 bg-gray-300 rounded w-64"></div>
            <div className="h-4 bg-gray-300 rounded w-48 mt-2"></div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/invoices"
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Invoice Not Found</h1>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Invoice</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchInvoice}
              className="btn btn-primary"
            >
              Try Again
            </button>
            <Link href="/invoices" className="btn btn-secondary">
              Back to Invoices
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/invoices"
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Invoice Not Found</h1>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice Not Found</h3>
          <p className="text-gray-600 mb-6">
            The invoice you're looking for doesn't exist or has been deleted.
          </p>
          <Link href="/invoices" className="btn btn-primary">
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/invoices"
          className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Invoice Details</h1>
          <p className="text-gray-600">View and manage invoice information</p>
        </div>
      </div>

      {/* Invoice Detail */}
      <InvoiceDetail invoice={invoice} onUpdate={handleInvoiceUpdate} />
    </div>
  );
}