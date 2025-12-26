import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

const vehicleTypeOptions = [
    { value: "truck", label: "Avtomobil" },
    { value: "trailer", label: "Tirkama" },
]
export const useColumnsVehicleTable = () => {
    return useMemo<ColumnDef<VehicleRoleType>[]>(
        () => [
            {
                accessorKey: "name",
                header: " Avtomobil nomi",
                enableSorting: true,
            },
            {
                accessorKey: "type",
                header: "Avtomobil turi",
                enableSorting: true,
                cell: ({ row }) => {
                    const typeValue = row.getValue("type")

                    const vehicleType = vehicleTypeOptions.find(
                        (option) => option.value === typeValue,
                    )

                    return vehicleType ? vehicleType.label : typeValue
                },
            },
        ],
        [],
    )
}
