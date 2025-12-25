import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const  useColumnDestricts = () => {
    return useMemo<ColumnDef<SettingsDistrictType>[]>(
        () => [
            {
                accessorKey: "name",
                header: "Tuman nomi",
                enableSorting: true,
                cell: ({ row }) => (
                    <div className="min-w-[180px] w-[220px] truncate">
                        {row.original.name || "-"}
                    </div>
                ),
            },
        ],
        [],
    )
}
