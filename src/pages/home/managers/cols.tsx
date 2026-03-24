import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowRight } from "lucide-react"
import { useMemo } from "react"
import { STATUS_LABELS } from "./managers-trips/cols"

const STATUS_COLORS: Record<number, string> = {
    1: "bg-green-500/10 text-green-600 border-transparent",    // Band
    2: "bg-gray-500/10 text-gray-500 border-transparent",       // Bo'sh
    3: "bg-orange-500/10 text-orange-600 border-transparent",  // Ta'mirda
}

// Hardcoded location data for demo
const LOCATION_DATA: Record<number, { from?: string; to?: string; location?: string }> = {
    1: { from: "Toshkent", to: "Samarqand" },
    2: { location: "Toshkent" },
    3: { location: "Garaj" },
}

export const useColumnsManagersVehicles = () => {
    return useMemo<ColumnDef<ManagerVehicles>[]>(
        () => [
            {
                accessorKey: "truck_number",
                header: "Avto raqami",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="">{row.original.truck_number || "-"}</div>
                ),
            },
            {
                accessorKey: "type",
                header: "Transpost turi",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="">{row.original.type || "-"}</div>
                ),
            },
            {
                accessorKey: "status",
                header: "Aylanma statusi",
                enableSorting: true,
                cell: ({ row }) => {
                    const status = row.original?.status
                    const colorClass = STATUS_COLORS[status] || "bg-gray-500/10 text-gray-500 border-gray-200"
                    return (
                        <Badge variant="outline" className={colorClass}>
                            {STATUS_LABELS[status] || "-"}
                        </Badge>
                    )
                },
            },
            {
                accessorKey: "location",
                header: "Joylashuv",
                enableSorting: false,
                cell: ({ row }) => {
                    const status = row.original?.status
                    const loc = LOCATION_DATA[status]
                    if (!loc) return <span className="text-muted-foreground">-</span>

                    // Bo'sh (2) or Ta'mirda (3) → single location
                    if (status === 2 || status === 3) {
                        return <span className="text-muted-foreground">{loc.location}</span>
                    }

                    // Band (1) → from → to
                    if (loc.from && loc.to) {
                        return (
                            <div className="flex items-center gap-1.5">
                                <span>{loc.from}</span>
                                <ArrowRight size={14} className="text-muted-foreground" />
                                <span>{loc.to}</span>
                            </div>
                        )
                    }

                    return <span className="text-muted-foreground">-</span>
                },
            },
            {
                accessorKey: "pending_orders",
                header: "Kutilayotgan reyslar",
                enableSorting: true,
            },
        ],
        [],
    )
}
