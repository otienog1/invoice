"use client"

import { Customer } from "@/types"
import { DataTable } from "@/components/ui/data-table"
import { createCustomersColumns } from "./customers-columns"

interface CustomersDataTableProps {
  data: Customer[]
  onEdit?: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
}

export function CustomersDataTable({ data, onEdit, onDelete }: CustomersDataTableProps) {
  const columns = createCustomersColumns({ onEdit, onDelete })
  
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Search customers..."
    />
  )
}