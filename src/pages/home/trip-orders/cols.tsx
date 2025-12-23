import { ColumnDef } from "@tanstack/react-table"
import { Truck } from "lucide-react"
import { useMemo } from "react"
import { format } from "date-fns"

export const useCostCols = () => {
  return useMemo<ColumnDef<TripOrdersRow>[]>(() => [
 
    {
      header: "Yuklash joyi",
      accessorKey: "loading_name",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">
          {getValue<string>()}
        </span>
      ),
    },

    {
      header: "Tushirish joyi",
      accessorKey: "unloading_name",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">
          {getValue<string>()}
        </span>
      ),
    },

    {
      header: "Yuk turi",
      accessorKey: "cargo_type_name",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue<string>() ?? "—"}
        </span>
      ),
    },

    {
      header: "To‘lov miqdori",
      accessorFn: (row) => row.payments?.[0]?.amount,
      cell: ({ getValue }) => (
        <span className="font-semibold">
          {getValue() ? Number(getValue()).toLocaleString("uz-UZ") : "—"}
        </span>
      ),
    },

    {
      header: "Valyuta",
      accessorFn: (row) => row.payments?.[0]?.currency,
      cell: ({ getValue }) => (
        <span>
          {getValue() === 1 ? "UZS" : getValue() === 2 ? "USD" : "—"}
        </span>
      ),
    },

    {
      header: "Yaratilgan sana",
      accessorKey: "created",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span>
          {format(new Date(getValue<string>()), "dd.MM.yyyy HH:mm")}
        </span>
      ),
    },
  ], [])
}
