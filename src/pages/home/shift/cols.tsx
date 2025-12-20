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
        header: "Mashina",
        accessorKey: "vehicle",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{row.original.vehicle}</span>
        ),
      },
      {
        header: "Haydovchi",
        accessorKey: "driver",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{row.original.driver}</span>
        ),
      },
      {
        header: "Boshlangan sana",
        accessorKey: "start",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{row.original.start}</span>
        ),
      },
      {
        header: "Reys turi",
        accessorKey: "type",
        enableSorting: true,
        cell: ({ row }) => (
          <span>{row.original.type}</span>
        ),
      },
    ],
    [],
  )
}
