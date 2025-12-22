import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsVehicleTable = () => {
    return useMemo<ColumnDef<VehicleRoleType>[]>(
        () => [
            {
                accessorKey: "name",
                header: " Avtomobil nomi",
                enableSorting: true,
            },
            {
                accessorKey: "type",
                header: "Avtomobil turi",
                enableSorting: true,
            },
        ],
        [],
    )
}
