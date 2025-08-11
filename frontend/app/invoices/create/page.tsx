'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import { invoicesApi } from '@/lib/api';
import { CreateInvoiceData } from '@/types';
import Link from 'next/link';

export default function CreateInvoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateInvoiceData) => {
    try {
      setLoading(true);
      const invoice = await invoicesApi.createInvoice({
        ...data,
        user_id: 1, // TODO: Get from auth context
      });
      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error('Error creating invoice:', error);
      // TODO: Show error message
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">Create Invoice</h1>
          <p className="text-gray-600">Create a new invoice for your customer</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <InvoiceForm 
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}