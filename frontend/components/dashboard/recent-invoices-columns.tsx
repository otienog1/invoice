"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Invoice } from "@/types"
import { formatDate, formatCurrency, getStatusColor } from "@/lib/utils"

export const recentInvoicesColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice_number",
    header: "Invoice",
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <Link 
          href={`/invoices/${invoice.id}`}
          className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          {invoice.invoice_number}
        </Link>
      )
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const invoice = row.original
      return (
        <div className="text-sm">
          {invoice.customer?.name || "Unknown Customer"}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge className={getStatusColor(status)} size="sm">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "total_amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total_amount"))
      return <div className="font-medium text-sm">{formatCurrency(amount)}</div>
    },
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      return <span className="text-sm text-muted-foreground">{formatDate(row.getValue("created_at"))}</span>
    },
  },
]