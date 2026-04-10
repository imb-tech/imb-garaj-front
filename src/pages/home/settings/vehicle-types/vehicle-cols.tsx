import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

const TYPE_LABELS: Record<number, string> = {
    1: "Yuk tashuvchi",
    2: "Qazuvchi",
}

export const useColumnsVehicleTable = () => {
    return useMemo<ColumnDef<any>[]>(
        () => [
            {
                accessorKey: "truck_number",
                header: "Avtomobil raqami",
                enableSorting: true,
            },
            {
                accessorKey: "type",
                header: "Avtomobil turi",
                enableSorting: true,
                cell: ({ row }) => {
                    const typeValue = row.getValue("type") as number
                    return (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-muted font-medium">
                            {TYPE_LABELS[typeValue] ?? "—"}
                        </span>
                    )
                },
            },
            {
                accessorKey: "driver",
                header: "Haydovchi",
                enableSorting: true,
                cell: ({ row }) => {
                    return row.getValue("driver") || "—"
                },
            },
        ],
        [],
    )
}
