import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsCashflowsTable = () => {
    return useMemo<ColumnDef<VehicleCashflowsType>[]>(
        () => [
            {
                accessorKey: "vehicle_number",
                header: "Avtomobil raqami",
                enableSorting: true,
            },
            {
                accessorKey: "category_name",
                header: "Xarajat turi",
                enableSorting: true,
            },
            {
                accessorKey: "comment",
                header: "Eslatmalar",
                enableSorting: true,
            },
        ],
        [],
    )
}
