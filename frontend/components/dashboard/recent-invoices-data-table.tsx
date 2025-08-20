"use client"

import { Invoice } from "@/types"
import { DataTable } from "@/components/ui/data-table"
import { recentInvoicesColumns } from "./recent-invoices-columns"

interface RecentInvoicesDataTableProps {
  data: Invoice[]
}

export function RecentInvoicesDataTable({ data }: RecentInvoicesDataTableProps) {
  return (
    <div className="w-full">
      <DataTable
        columns={recentInvoicesColumns}
        data={data}
        searchKey="invoice_number"
        searchPlaceholder="Search recent invoices..."
      />
    </div>
  )
}