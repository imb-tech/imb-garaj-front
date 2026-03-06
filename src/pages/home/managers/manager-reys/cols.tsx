import { formatMoney } from "@/lib/format-money"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { STATUS_LABELS } from "../managers-trips/cols"

export const useColumnsManagersOrders = () => {
    return useMemo<ColumnDef<ManagerOrders>[]>(
        () => [
            {
                accessorKey: "loading",
                header: "Yuklash joyi",
                enableSorting: true,
            },
            {
                accessorKey: "unloading",
                header: "Tushirish joyi",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="">{row.original.type || "-"}</div>
                ),
            },
            {
                accessorKey: "created_at",
                header: "Yaratilgan sana",
                enableSorting: true,
            },
            {
                accessorKey: "cargo_type_name",
                header: "Yuk turi",
                enableSorting: true,
            },
            {
                accessorKey: "date",
                header: "Yaratilagan sana",
                enableSorting: true,
            },
            {
                accessorKey: "payment_amount",
                header: "Olingan pul",
                enableSorting: true,
                cell: ({ row }) => {
                    return (
                        <span>
                            {formatMoney(row.original.payment_amount || "-")}
                        </span>
                    )
                },
            },
            {
                accessorKey: "status",
                header: "Aylanma statusi",
                enableSorting: true,
                cell: ({ row }) => {
                    const status = row.original?.status
                    return <div>{STATUS_LABELS[status] || "-"}</div>
                },
            },
        ],
        [],
    )
}
