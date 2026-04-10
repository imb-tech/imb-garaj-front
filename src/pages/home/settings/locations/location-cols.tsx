import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { MapPin } from "lucide-react"
import { useMemo } from "react"
import type { LocationItem } from "./types"

const typeLabels: Record<string, string> = {
    loading: "Yuklash",
    unloading: "Tushirish",
}

export const useLocationColumns = () => {
    return useMemo<ColumnDef<LocationItem>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Nomi",
                enableSorting: true,
            },
            {
                accessorKey: "type",
                header: "Turi",
                enableSorting: true,
                cell: ({ row }) => {
                    const type = row.getValue("type") as string
                    return (
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                                type === "loading"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
                            )}
                        >
                            <MapPin size={12} />
                            {typeLabels[type] ?? type}
                        </span>
                    )
                },
            },
        ],
        [],
    )
}
