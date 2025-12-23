import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsCountriesTable = () => {
    return useMemo<ColumnDef<RolesType>[]>(
        () => [
            {
                header: "№",
            },
            {
                header: "Davlat nomi",
            },
        ],
        [],
    )
}
