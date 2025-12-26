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
                cell: ({ getValue }) => {
                    const currencyValue = getValue<number>()

                    if (!currencyValue) {
                        return <span>—</span>
                    }

                    const currencyMap = {
                        1: "UZS - So'm",
                        2: "USD - AQSh dollari",
                    }

                    return (
                        <span>
                            {currencyMap[
                                currencyValue as keyof typeof currencyMap
                            ] || "—"}
                        </span>
                    )
                },
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
