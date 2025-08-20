'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, TrendingUp } from 'lucide-react';
import { Invoice } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import Link from 'next/link';

interface RecentInvoicesTableProps {
  invoices?: Invoice[];
  onAddInvoice?: () => void;
  loading?: boolean;
}

export function RecentInvoicesTable({ invoices = [], onAddInvoice, loading = false }: RecentInvoicesTableProps) {

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            Recent Invoices
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Latest invoice activities and status
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-green-600 border-green-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12%
          </Badge>
          <Button 
            size="sm" 
            onClick={onAddInvoice}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Invoice
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse p-3 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-300 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))
          ) : invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent invoices</p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {invoice.customer?.name || 'Unknown Customer'}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={`text-xs px-2 py-0.5 ${getStatusColor(invoice.status)}`}
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{invoice.invoice_number}</span>
                      <span>{invoice.customer?.email}</span>
                      <span>{formatDate(invoice.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(Number(invoice.total_amount))}
                  </p>
                  <Link 
                    href={`/invoices/${invoice.id}`}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Link href="/invoices">
            <Button variant="outline" className="w-full">
              View All Invoices
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}