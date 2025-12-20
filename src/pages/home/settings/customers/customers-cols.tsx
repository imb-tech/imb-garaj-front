import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsCustomersTable = () => {
    return useMemo<ColumnDef<CustomersType>[]>(
        () => [
            {
                accessorKey: "name",
                header: "F.I.O",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="min-w-[180px] w-[220px] truncate">
                        {row.original.name}
                    </div>
                ),
            },
            {
                accessorKey: "company_name",
                header: "Tashkilot",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="min-w-[180px] w-[220px] truncate">
                        {row.original.company_name}
                    </div>
                ),
            },
            {
                accessorKey: "address",
                header: "Manzil",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="min-w-[220px] w-[300px] truncate">
                        {row.original.address}
                    </div>
                ),
            },
            {
                accessorKey: "loading_coordinates",
                header: "Yuk olish koordinatalari",
                enableSorting: false,
                cell: ({ row }) => {
                    const coords = row.original.loading_coordinates as number[]
                    if (!coords || coords.length !== 2) return "-"
                    return `${coords[0]?.toFixed(6)},${coords[1]?.toFixed(6)}`
                },
            },
            {
                accessorKey: "coordinates",
                header: "Koordinatalar",
                enableSorting: false,
                cell: ({ row }) => {
                    const coords = row.original.coordinates as number[]
                    if (!coords || coords.length !== 2) return "-"
                    return `${coords[0]?.toFixed(6)}, ${coords[1]?.toFixed(6)}`
                },
            },
            {
                accessorKey: "phone_number",
                header: "Telefon raqami",
                enableSorting: true,
            },
            {
                accessorKey: "email",
                header: "Elektron pochta",
                enableSorting: true,
            },
            {
                accessorKey: "note",
                header: "Eslatmalar",
                enableSorting: true,
                cell: ({ row }) => {
                    const note = row.getValue("note") as string
                    return note ?
                            <div
                                className="max-w-[200px] truncate"
                                title={note}
                            >
                                {note}
                            </div>
                        :   "-"
                },
            },
            {
                accessorKey: "schedules",
                header: "Ish vaqti",
                enableSorting: false,
                cell: ({ row }) => {
                    const schedules = row.original.schedules
                    if (!schedules || schedules.length === 0) return "-"

                    return (
                        <div
                            className="max-w-[120px] truncate"
                            title={`${schedules.length} kun`}
                        >
                            {schedules.length} kun
                        </div>
                    )
                },
            },
        ],
        [],
    )
}
