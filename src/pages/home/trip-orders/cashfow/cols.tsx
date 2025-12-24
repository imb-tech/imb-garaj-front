import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { format } from "date-fns"

export const useCostCols = () => {
  return useMemo<ColumnDef<CashflowRow>[]>(() => [
    {
      header: "ID",
      accessorKey: "id",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span className="font-mono">{getValue<number>()}</span>
      ),
    },

    {
      header: "Amal",
      accessorKey: "action",
      enableSorting: true,
      cell: ({ getValue }) => {
        const value = getValue<number>()

        return (
          <span>
            {value === 1
              ? "Driver to Manager(D2M)"
              : value === 2
              ? "Manager to Driver(M2D)"
              : "—"}
          </span>
        )
      },
    },

    {
      header: "Izoh",
      accessorKey: "comment",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue<string>() || "—"}
        </span>
      ),
    },

    {
      header: "Ijrochi",
      accessorKey: "executor",
      cell: ({ getValue }) => (
        <span>{getValue<number>()}</span>
      ),
    },

    {
      header: "Tranzaksiya",
      accessorKey: "transaction",
      cell: ({ getValue }) => (
        <span>{getValue<number>()}</span>
      ),
    },

    {
      header: "Buyurtma ID",
      accessorKey: "order",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span>{getValue<number>()}</span>
      ),
    },

    {
      header: "Kategoriya",
      accessorKey: "category",
      cell: ({ getValue }) => (
        <span>{getValue<number>()}</span>
      ),
    },

    {
      header: "Yaratilgan sana",
      accessorKey: "created",
      enableSorting: true,
      cell: ({ getValue }) => (
        <span>
          {getValue<string>()
            ? format(new Date(getValue<string>()), "dd.MM.yyyy HH:mm")
            : "—"}
        </span>
      ),
    },
  ], [])
}
