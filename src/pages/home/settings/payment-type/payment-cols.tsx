import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsPaymentTable = () => {
    return useMemo<ColumnDef<RolesType>[]>(
        () => [
            {
                accessorKey: "name",
                header: "To'lov turi",
                enableSorting: true,
            },
        ],
        [],
    )
}
