import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useCostCols = () => {
    return useMemo<ColumnDef<Truck>[]>(
        () => [
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
                    return (
                        <span>
                            {row.original.truck_type_name || "Noma'lum"}
                        </span>
                    )
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
                    <span className="text-sm">
                        {row.original.truck_passport}
                    </span>
                ),
            },
            {
                header: "Tirkama raqami",
                accessorKey: "trailer_number",
                enableSorting: true,
                cell: ({ row }) => (
                    <span>
                        {row.original.trailer_number || "—"}
                    </span>
                ),
            },
            {
                header: "Haydovchi",
                accessorKey: "driver_name",
                enableSorting: true,
                cell: ({ row }) => (
                    <span className="font-medium">
                        {row.original.driver_name}
                    </span>
                ),
            },
            {
                header: "Yaratilgan sana",
                accessorKey: "created",
                enableSorting: true,
                cell: ({ row }) => {
                    const date = new Date(row.original.created)
                    return <span>{date.toLocaleDateString("uz-UZ")}</span>
                },
            },
            {
                header: "Transport statusi",
                accessorKey: "status",
                enableSorting: true,
                cell: ({ row }) => {
                    const typeMap: Record<number, string> = {
                        1: "Band",
                        2: "Bo'sh",
                        3: "Ta'mirlanmoqda",
                    }
                    return (
                        <span>
                            {typeMap[row.original.status] || "Noma'lum"}
                        </span>
                    )
                },
            },
        ],
        [],
    )
}
