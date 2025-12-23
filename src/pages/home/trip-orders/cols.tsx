import { CopyButton } from "@/lib/copy-button"
import { ColumnDef } from "@tanstack/react-table"
import { Truck } from "lucide-react"
import { useMemo } from "react"
import { format } from "date-fns"



export const useCostCols = () => {
  return useMemo<ColumnDef<TripOrdersRow>[]>(() => [
    {
      header: "ID",
      accessorKey: "id",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <Truck className="w-4 h-4 text-muted-foreground" />
          {row.original.id}
        </div>
      ),
    },
    {
      header: "Yuklash joyi ID",
      accessorKey: "loading",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono text-sm">#{row.original.loading}</span>
      ),
    },
    {
      header: "Tushirish joyi ID",
      accessorKey: "unloading",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono text-sm">#{row.original.unloading}</span>
      ),
    },
    {
      header: "Transport ID",
      accessorKey: "trip",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-semibold">#{row.original.trip}</span>
      ),
    },
    {
      header: "Yuk turi",
      accessorKey: "cargo_type",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.cargo_type ? `ID: ${row.original.cargo_type}` : "—"}
        </span>
      ),
    },
    {
      header: "Yaratilgan sana",
      accessorKey: "created",
      enableSorting: true,
      cell: ({ row }) => {
        const date = new Date(row.original.created)
        return (
          <span>{format(date, "dd.MM.yyyy HH:mm")}</span>
        )
      },
    },
  ], [])
}