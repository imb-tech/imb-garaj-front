import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useMemo } from "react"

 
const FUEL_TYPES: Record<number, string> = {
    1: "Benzin",
    2: "Dizel",
    3: "Gaz",
    4: "Elektr",
    5: "Gibrid",
    6: "Propan",
}

const VEHICLE_TYPES: Record<number, string> = {
    1: "Yengil avtomobil",
    2: "Yuk avtomobili",
    3: "Avtobus",
    4: "Treyler",
    5: "Maxsus texnika",
}

export const useColumnsCarsTable = () => {
    return useMemo<ColumnDef<CarsType>[]>(
        () => [
            {
                accessorKey: "number",
                header: "Avtomobil raqami",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="font-medium">{row.original.number}</div>
                ),
            },
            {
                accessorKey: "type",
                header: "Avtomobil turi",
                enableSorting: true,
                cell: ({ row }) => {
                    const typeId = row.original.type
                    return (
                        <span>{VEHICLE_TYPES[typeId] || `Turi ${typeId}`}</span>
                    )
                },
            },
            {
                accessorKey: "driver",
                header: "Haydovchi ID",
                enableSorting: true,
                cell: ({ row }) => `ID: ${row.original.driver}`,
            },
            {
                accessorKey: "license",
                header: "Guvohnoma raqami",
                enableSorting: true,
            },
            {
                accessorKey: "serial_number",
                header: "Seriya raqami",
                enableSorting: true,
            },
            {
                accessorKey: "year",
                header: "Ishlab chiqarilgan yili",
                enableSorting: true,
                cell: ({ row }) => {
                    const date = row.original.year
                    return date ? format(new Date(date), "dd.MM.yyyy") : "-"
                },
            },
            {
                accessorKey: "fuel_type",
                header: "Yoqilg'i turi",
                enableSorting: true,
                cell: ({ row }) => {
                    const fuelId = row.original.fuel_type
                    return (
                        <span>
                            {FUEL_TYPES[fuelId] || `Noma'lum (${fuelId})`}
                        </span>
                    )
                },
            },
            {
                accessorKey: "size",
                header: "Yuk sig'imi (kg)",
                enableSorting: true,
                cell: ({ row }) => {
                    const size = row.original.size
                    return size ? `${size.toLocaleString()} kg` : "-"
                },
            },
            {
                accessorKey: "depot",
                header: "Ombor / Depo",
                enableSorting: true,
                cell: ({ row }) => `Depo #${row.original.depot}`,
            },
        ],
        [],
    )
}
