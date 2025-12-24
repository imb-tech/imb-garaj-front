import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";


export const useCostCols = () => {
  return useMemo<ColumnDef<Truck>[]>(() => [
    {
      header: "Avtoraqam",
      accessorKey: "truck_number",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-semibold uppercase">
          {row.original.truck_number}
        </span>
      ),
    },
    {
      header: "Transport turi",
      accessorKey: "truck_type",
      enableSorting: true,
      cell: ({ row }) => {
        const typeMap: Record<number, string> = {
          1: "Fura",
          2: "Tent",
          3: "Refrigerator",
          4: "Yengil yuk",
        };
        return <span>{typeMap[row.original.truck_type] || "Noma'lum"}</span>;
      },
    },
    {
      header: "Yoqilg'i turi",
      accessorKey: "fuel",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="capitalize">{row.original.fuel}</span>
      ),
    },
    {
      header: "Pasport raqami",
      accessorKey: "truck_passport",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-mono text-sm">{row.original.truck_passport}</span>
      ),
    },
    {
      header: "Tirkama raqami",
      accessorKey: "trailer_number",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.trailer_number || "—"}
        </span>
      ),
    },
    {
      header: "Haydovchi",
      accessorKey: "driver_name",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.driver_name}</span>
      ),
    },
    {
      header: "Yaratilgan sana",
      accessorKey: "created",
      enableSorting: true,
      cell: ({ row }) => {
        const date = new Date(row.original.created);
        return <span>{date.toLocaleDateString("uz-UZ")}</span>;
      },
    },
  ], []);
};