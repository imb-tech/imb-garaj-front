import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { EXPENSE_TYPE_OPTIONS } from "./add-expenses"

export const useColumnsExpensesTable = () => {
    return useMemo<ColumnDef<VehicleRoleType>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Xarajat nomi",
                enableSorting: true,
            },
            {
                accessorKey: "type",
                header: "Xarajat turi",
                enableSorting: true,
                cell: ({ row }) => {
                    const typeValue = row.original.type

                    const typeOption = EXPENSE_TYPE_OPTIONS.find(
                        (option: { value: any }) => option.value === typeValue,
                    )

                    return (
                        <span>
                            {typeOption ? typeOption.label : "Noma'lum"}
                        </span>
                    )
                },
            },
        ],
        [],
    )
}
