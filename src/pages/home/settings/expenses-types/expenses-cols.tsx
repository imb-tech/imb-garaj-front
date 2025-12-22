import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsExpensesTable = () => {
    return useMemo<ColumnDef<VehicleRoleType>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Xarajat nomi",
                enableSorting: true,
            },
            {
                accessorKey: "turi",
                header: "Xarajat turi",
                enableSorting: true,
            },
        ],
        [],
    )
}
