import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"
import { STATUS_LABELS } from "./managers-trips/cols"
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
            // {
            //     accessorKey: "driver_name",
            //     header: "Haydovchi",
            //     enableSorting: true,
            //     cell: ({ row }) => <div>{row.original.driver_name || "-"}</div>,
            // },
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
                accessorKey:'Kutilayotgan reyslar',
                header:"Kutilayotgan reyslar",
                enableSorting:true
            }
        ],
        [],
    )
}
