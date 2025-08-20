"use client"

import { Invoice } from "@/types"
import { DataTable } from "@/components/ui/data-table"
import { invoicesColumns } from "./invoices-columns"

interface InvoicesDataTableProps {
  data: Invoice[]
}

export function InvoicesDataTable({ data }: InvoicesDataTableProps) {
  return (
    <DataTable
      columns={invoicesColumns}
      data={data}
      searchKey="invoice_number"
      searchPlaceholder="Search invoices..."
    />
  )
}