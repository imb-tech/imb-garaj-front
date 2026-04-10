import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowRight } from "lucide-react"
import { useMemo } from "react"
const AYLANMA_LABELS: Record<number, string> = {
    1: "Faol",
    2: "Faol emas",
}

const AYLANMA_COLORS: Record<number, string> = {
    1: "bg-green-500/10 text-green-600 border-transparent",
    2: "bg-gray-500/10 text-gray-500 border-transparent",
}

export const useColumnsManagersVehicles = () => {
    return useMemo<ColumnDef<ManagerVehicles>[]>(
        () => [
            {
                accessorKey: "truck_number",
                header: "Avto raqami",
                enableSorting: true,
                cell: ({ row }) => (
                    <div>{row.original.truck_number || "-"}</div>
                ),
            },
            {
                accessorKey: "type",
                header: "Transpost turi",
                enableSorting: true,
                cell: ({ row }) => (
                    <div>{row.original.type || "-"}</div>
                ),
            },
            {
                accessorKey: "driver_name",
                header: "Haydovchi",
                enableSorting: true,
                cell: ({ row }) => (
                    <div>{row.original.driver_name || "-"}</div>
                ),
            },
            {
                accessorKey: "status",
                header: "Aylanma statusi",
                enableSorting: true,
                cell: ({ row }) => {
                    const status = row.original?.status
                    const colorClass = AYLANMA_COLORS[status] || "bg-gray-500/10 text-gray-500 border-transparent"
                    return (
                        <Badge variant="outline" className={colorClass}>
                            {AYLANMA_LABELS[status] || "Faol emas"}
                        </Badge>
                    )
                },
            },
            {
                accessorKey: "loading_name",
                header: "Joylashuv",
                enableSorting: false,
                cell: ({ row }) => {
                    const { loading_name, unloading_name, status } = row.original

                    // Bo'sh (2) or Ta'mirda (3) → no active route
                    if (status === 2 || status === 3) {
                        return <span className="text-muted-foreground">-</span>
                    }

                    // Band (1) → from → to
                    if (loading_name && unloading_name) {
                        return (
                            <div className="flex items-center gap-1.5">
                                <span>{loading_name}</span>
                                <ArrowRight size={14} className="text-muted-foreground" />
                                <span>{unloading_name}</span>
                            </div>
                        )
                    }

                    return <span className="text-muted-foreground">{loading_name || unloading_name || "-"}</span>
                },
            },
        ],
        [],
    )
}
