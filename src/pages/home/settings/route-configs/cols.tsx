import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export type RouteConfigRow = {
    id: string
    client_name: string
    loading_name: string
    unloading_name: string
    cargo_type_name: string
    payment_type_name: string
    currency_name: string
    amount: string | null
}

const formatAmount = (amount: string | null) => {
    if (!amount) return "-"
    const n = Number(amount)
    if (Number.isNaN(n)) return amount
    return n.toLocaleString("fr-FR").replace(/\u00a0/g, " ")
}

export const useRouteConfigsColumns = () =>
    useMemo<ColumnDef<RouteConfigRow>[]>(
        () => [
            { accessorKey: "client_name", header: "Yuk egasi" },
            { accessorKey: "loading_name", header: "Yuklash manzili" },
            {
                accessorKey: "unloading_name",
                header: "Yuk tushirish manzili",
            },
            { accessorKey: "cargo_type_name", header: "Yuk turi" },
            { accessorKey: "payment_type_name", header: "To'lov turi" },
            { accessorKey: "currency_name", header: "Valyuta" },
            {
                accessorKey: "amount",
                header: "Summa",
                cell: ({ row }) => formatAmount(row.original.amount),
            },
        ],
        [],
    )
