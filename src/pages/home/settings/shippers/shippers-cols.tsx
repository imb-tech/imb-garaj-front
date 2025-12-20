import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsShippersTable = () => {
    return useMemo<ColumnDef<ShippersType>[]>(
        () => [
            {
                accessorKey: "name",
                header: "F.I.O",
                enableSorting: true,
            },
        ],
        [],
    )
}
