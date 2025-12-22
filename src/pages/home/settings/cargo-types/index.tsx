import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsCargoTable = () => {
    return useMemo<ColumnDef<RolesType>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Rol turi",
                enableSorting: true,
            },
        ],
        [],
    )
}
