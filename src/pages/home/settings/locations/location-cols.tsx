import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import type { LocationFeature } from "./types"

export const useLocationColumns = () => {
    return useMemo<ColumnDef<LocationFeature>[]>(
        () => [
            {
                id: "name",
                header: "Nomi",
                enableSorting: true,
                accessorFn: (row) => row.properties.name,
            },
            {
                id: "address",
                header: "Manzil",
                enableSorting: true,
                accessorFn: (row) => row.properties.address,
                cell: ({ getValue }) => getValue() || "—",
            },
        ],
        [],
    )
}
