import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsCustomersTable = () => {
    return useMemo<ColumnDef<CustomersType>[]>(
        () => [
            {
                accessorKey: "name",
                header: "F.I.O",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="min-w-[180px] w-[220px] truncate">
                        {row.original.name || "-"}
                    </div>
                ),
            },
            {
                accessorKey: "phone_number",
                header:"Telefon raqami",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="min-w-[180px] w-[220px] truncate">
                        {row.original.phone_number || "-"}
                    </div>
                ),
            },
        ],
        [],
    )
}
