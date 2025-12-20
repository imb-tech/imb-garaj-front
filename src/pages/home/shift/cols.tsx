import { CopyButton } from "@/lib/copy-button"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useCostCols = () => {
  return useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{CopyButton(row.original.id)}</span>
        ),
      },
      {
        header: "Mashina raqami",
        accessorKey: "vehicle_number",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{row.original.vehicle_number}</span>
        ),
      },
      {
        header: "Boshlangan sana",
        accessorKey: "start_date",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{row.original.start_date}</span>
        ),
      },
      {
        header: "Reys turi",
        accessorKey: "shift_type",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{row.original.shift_type}</span>
        ),
      },
    ],
    [],
  )
}
