import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsOrderPayment = () => {
    return useMemo<ColumnDef<OrderPaymentType>[]>(
        () => [
            {
                header: "To'lov turi",
                accessorKey: "payment_type_name",
                enableSorting: true,
            },
            {
                header: "Pul birligi",
                accessorKey: "currency",
                cell: ({ getValue }) => (
                    <span className="text-muted-foreground">
                        {getValue<string>() || "—"}
                    </span>
                ),
            },

            {
                header: "Pul birlig kursi",
                accessorKey: "currency_course",
                cell: ({ getValue }) => <span>{getValue<number>()}</span>,
            },

            {
                header: "Miqdor",
                accessorKey: "amount",
                enableSorting: true,
            },
        ],
        [],
    )
}
