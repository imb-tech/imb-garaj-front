import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsWarehouseTable = () => {
    return useMemo<ColumnDef<WarehouseType>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Ombor nomi",
                enableSorting: true,
            },
            {
                accessorKey: "address",
                header: "Manzil",
                enableSorting: true,
            },
            {
                accessorKey: "location",
                header: "Kenglik (Latitude)",
                enableSorting: true,
                cell: ({ row }) => {
                    const location = row.original.location
                    return location && location[1] ?
                            location[1].toFixed(6)
                        :   "—"
                },
            },
            {
                accessorKey: "location",
                header: "Uzunlik (Longitude)",
                enableSorting: true,
                cell: ({ row }) => {
                    const location = row.original.location

                    return location && location[0] ?
                            location[0].toFixed(6)
                        :   "—"
                },
            },
        ],
        [],
    )
}
