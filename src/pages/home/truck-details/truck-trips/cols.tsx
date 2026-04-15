import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { formatMoney } from "@/lib/format-money"
import { Badge } from "@/components/ui/badge"

export interface OrderTripType {
    date: string
    loading_name: string
    unloading_name: string
    cargo_type_name: string | null
    client_name: string | null
    income: number
    type: number
}

export interface TripDailyStatisticType {
    id: number
    total_expense: number | null
    total_mileage: number
    start_mileage_image: string | null
    end_mileage_image: string | null
    fuel_consume: number
    orders_trip: OrderTripType[]
}

export const useOrderCols = (opts?: { onExpenseClick?: (tripId: number) => void }) => {
    return useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: "Sana",
                accessorKey: "date",
                enableSorting: false,
                cell: ({ row }) => {
                    const data = row.original;
                    if (data.is_summary) return <span className="font-bold text-black">Jami</span>
                    return <span className="font-medium text-muted-foreground">{data.date}</span>
                },
            },
            {
                header: "Marshrut",
                accessorKey: "route",
                enableSorting: false,
                cell: ({ row }) => {
                    const data = row.original;
                    if (data.is_summary) return null;
                    return (
                        <span>
                            {data.loading_name} - {data.unloading_name}
                        </span>
                    )
                },
            },
            {
                header: "Yuk turi",
                accessorKey: "cargo_type_name",
                enableSorting: false,
                cell: ({ row }) => {
                    const data = row.original;
                    if (data.is_summary) {
                        return <span className="font-bold text-black">{data.cargo_type_name || ""}</span>
                    }
                    if (data.type === 2) {
                        return <Badge variant="secondary">Bo'sh</Badge>
                    }
                    if (data.type === 1 && !data.cargo_type_name) {
                        return <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/15">Band</Badge>
                    }
                    return <span>{data.cargo_type_name || "—"}</span>
                },
            },
            {
                header: "Firma (Mijoz)",
                accessorKey: "client_name",
                enableSorting: false,
                cell: ({ row }) => {
                    const data = row.original;
                    if (data.is_summary) return null;
                    return <span>{data.client_name || "—"}</span>
                },
            },
            {
                header: "Masofa",
                accessorKey: "total_mileage",
                enableSorting: false,
                cell: ({ row }) => {
                    const data = row.original;
                    if (!data.is_summary) return null;
                    return <span className="font-bold text-black">{data.total_mileage} km</span>
                },
            },
            {
                header: "Yoqilg'i sarfi",
                accessorKey: "fuel_consume",
                enableSorting: false,
                cell: ({ row }) => {
                    const data = row.original;
                    if (!data.is_summary) return null;
                    return <span className="font-bold text-black">{data.fuel_consume}</span>
                },
            },
            {
                header: "Tushum",
                accessorKey: "income",
                enableSorting: false,
                cell: ({ row }) => {
                    const data = row.original;
                    if (data.is_summary) {
                        return <span className="font-bold text-black">{data.income ? formatMoney(data.income) : "—"}</span>
                    }
                    return <span className="font-medium text-green-600">{data.income ? formatMoney(data.income) : "—"}</span>
                },
            },
            {
                header: "Xarajat",
                accessorKey: "total_expense",
                enableSorting: false,
                cell: ({ row }) => {
                    const data = row.original;
                    if (!data.is_summary) return null;
                    return (
                        <span
                            className="font-bold text-black underline cursor-pointer hover:text-primary"
                            onClick={(e) => {
                                e.stopPropagation()
                                opts?.onExpenseClick?.(data.trip_id)
                            }}
                        >
                            {data.total_expense ? formatMoney(data.total_expense) : "—"}
                        </span>
                    )
                },
            },
            {
                header: "Foyda",
                id: "profit",
                enableSorting: false,
                cell: ({ row }) => {
                    const data = row.original;
                    if (!data.is_summary) return null;
                    const profit = (data.income || 0) - (data.total_expense || 0)
                    return <span className={`font-bold ${profit >= 0 ? "text-black" : "text-red-600"}`}>{formatMoney(profit)}</span>
                },
            },
        ],
        [opts?.onExpenseClick],
    )
}

export const useCostCols = useOrderCols
