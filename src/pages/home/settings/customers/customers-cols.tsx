import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { formatPhoneNumber } from "./phone-number"

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
                header: "Telefon raqami",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="min-w-[180px] w-[220px] truncate">
                        {formatPhoneNumber(row.original.phone_number)}
                    </div>
                ),
                sortingFn: (rowA, rowB, columnId) => {
                    const phoneA = rowA.getValue(columnId) as string
                    const phoneB = rowB.getValue(columnId) as string
                    const digitsA = (phoneA || "").replace(/\D/g, "")
                    const digitsB = (phoneB || "").replace(/\D/g, "")
                    return digitsA.localeCompare(digitsB)
                },
            },
        ],
        [],
    )
}
