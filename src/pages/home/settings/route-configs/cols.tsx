import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export type SelectableItem = { id: number; name: string }

export type DirectionRow = {
    id: number
    owner_name: string
    load_name: string
    unload_name: string
    cargo_type_name: string
    payment_type_name: string
    currency: 1 | 2
    amount: string | null
}

const CURRENCY_LABELS: Record<number, string> = {
    1: "UZS",
    2: "USD",
}

const formatAmount = (amount: string | null) => {
    if (!amount) return "-"
    const n = Number(amount)
    if (Number.isNaN(n)) return amount
    return n.toLocaleString("fr-FR").replace(/\u00a0/g, " ")
}

export const useDirectionColumns = () =>
    useMemo<ColumnDef<DirectionRow>[]>(
        () => [
            { accessorKey: "load_name", header: "Yuklash manzili" },
            { accessorKey: "unload_name", header: "Yuk tushirish manzili" },
            { accessorKey: "owner_name", header: "Yuk egasi" },
            { accessorKey: "cargo_type_name", header: "Yuk turi" },
            { accessorKey: "payment_type_name", header: "To'lov turi" },
            {
                accessorKey: "currency",
                header: "Valyuta",
                cell: ({ row }) =>
                    CURRENCY_LABELS[row.original.currency] ?? "-",
            },
            {
                accessorKey: "amount",
                header: "Summa",
                cell: ({ row }) => formatAmount(row.original.amount ?? null),
            },
        ],
        [],
    )
