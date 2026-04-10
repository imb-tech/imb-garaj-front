import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsSecurityTable = () => {
    return useMemo<ColumnDef<SecurityRequestType>[]>(
        () => [
            {
                accessorKey: "car_number",
                header: "Mashina raqami",
                enableSorting: true,
            },
            {
                accessorKey: "driver_name",
                header: "Haydovchi",
                enableSorting: true,
            },
            {
                accessorKey: "status",
                header: "Holati",
                enableSorting: true,
            },
            {
                accessorKey: "created_at",
                header: "Sana",
                enableSorting: true,
            },
        ],
        [],
    )
}
