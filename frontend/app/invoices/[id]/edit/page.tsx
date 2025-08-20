'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InvoiceForm } from '@/components/invoice/InvoiceForm';
import { PageLayout } from '@/components/layout/PageLayout';
import { invoicesApi } from '@/lib/api';
import { Invoice, CreateInvoiceData } from '@/types';

interface EditInvoicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditInvoicePage({ params }: EditInvoicePageProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>('');

  useEffect(() => {
    const getParams = async () => {
      const { id: paramId } = await params;
      setId(paramId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchInvoice();
    }
  }, [id]);

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      setError(null);
      const invoiceId = parseInt(id);
      const data = await invoicesApi.getInvoice(invoiceId);
      setInvoice(data);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError('Failed to load invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateInvoiceData) => {
    if (!invoice) return;

    try {
      setSubmitting(true);
      await invoicesApi.updateInvoice(invoice.id, data);
      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error('Error updating invoice:', error);
      // TODO: Show error message
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async (data: CreateInvoiceData) => {
    if (!invoice) return;

    try {
      setSubmitting(true);
      await invoicesApi.updateInvoice(invoice.id, { ...data, status: 'draft' });
      router.push(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error('Error saving draft:', error);
      // TODO: Show error message
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="Loading..."
        subtitle="Loading invoice for editing"
        breadcrumb="Edit Invoice"
        backUrl={`/invoices/${id}`}
        showSearch={false}
        showActions={false}
      >
        <Card className="bg-card/50 backdrop-blur border-border/50 animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-64"></div>
              <div className="h-4 bg-gray-300 rounded w-48"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="Error"
        subtitle="Error loading invoice"
        breadcrumb="Edit Invoice"
        backUrl={`/invoices/${id}`}
        showSearch={false}
        showActions={false}
      >
        <Card className="bg-card/50 backdrop-blur border-border/50 p-12 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Invoice</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <Button onClick={fetchInvoice} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push(`/invoices/${id}`)}>
              Back to Invoice
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  if (!invoice) {
    return (
      <PageLayout
        title="Not Found"
        subtitle="Invoice not found"
        breadcrumb="Edit Invoice"
        backUrl="/invoices"
        showSearch={false}
        showActions={false}
      >
        <Card className="bg-card/50 backdrop-blur border-border/50 p-12 text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Invoice Not Found</h3>
          <p className="text-muted-foreground mb-6">
            The invoice you're trying to edit doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push('/invoices')} className="bg-blue-600 hover:bg-blue-700">
            Back to Invoices
          </Button>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Edit Invoice"
      subtitle={`Edit invoice ${invoice.invoice_number}`}
      breadcrumb={`Edit ${invoice.invoice_number}`}
      backUrl={`/invoices/${invoice.id}`}
      showSearch={false}
      showActions={false}
    >
      <div className="bg-card/50 backdrop-blur border-border/50 rounded-lg">
        <InvoiceForm
          invoice={invoice}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          loading={submitting}
        />
      </div>
    </PageLayout>
  );
}