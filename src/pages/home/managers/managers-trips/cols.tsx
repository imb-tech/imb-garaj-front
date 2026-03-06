import { formatMoney } from "@/lib/format-money"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
export const STATUS_LABELS:any = {
    1: "Band",
    2: "Bo'sh",
    3: "Ta'mirda",
}
export const useColumnsManagersTrips = () => {
    return useMemo<ColumnDef<ManagerTrips>[]>(
        () => [
            {
                accessorKey: "start",
                header: "Chiqib ketgan vaqt",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="">{row.original.start || "-"}</div>
                ),
            },
            {
                accessorKey: "end",
                header: "Tugallangan vaqti",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="">{row.original.end || "-"}</div>
                ),
            },
            {
                accessorKey: "driver_name",
                header: "Haydovchi",
                enableSorting: true,
                cell: ({ row }) => <div>{row.original.driver_name || "-"}</div>,
            },
            {
                accessorKey: "pending_order_count",
                header: "Kutilayotgan reyslar",
                enableSorting: true,
                cell: ({ row }) => (
                    <div>{row.original.pending_order_count || "-"}</div>
                ),
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
            {
                accessorKey: "income",
                header: "Tushum",
                enableSorting: true,
                cell: ({ row }) => (
                    <div>{formatMoney(row.original.income)}</div>
                ),
            },
            {
                accessorKey: "cash_flow_sum",
                header: "Harajat",
                enableSorting: true,
                cell: ({ row }) => (
                    <div>{formatMoney(row.original.cash_flow_sum)}</div>
                ),
            },
        ],
        [],
    )
}
