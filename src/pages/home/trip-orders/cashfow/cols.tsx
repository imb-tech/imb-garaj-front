import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { format } from "date-fns"

export const useCostCols = () => {
  return useMemo<ColumnDef<CashflowRow>[]>(() => [
    {
      header: "Amal",
      accessorKey: "action",
      enableSorting: true,
      cell: ({ getValue }) => {
        const value = getValue<number>()

        return (
          <span>
            {value === 1
              ? "Haydovchidan Menejerga (D2M)"
              : value === 2
              ? "Menejerdan Haydovchiga (M2D)"
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
      header: "Kategoriya",
      accessorKey: "category_name",
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
