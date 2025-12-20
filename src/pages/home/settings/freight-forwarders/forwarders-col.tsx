import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

 
export const useColumnsForwardersTable = () => {
    return useMemo<ColumnDef<ForwardersType>[]>(
        () => [
            {
                accessorKey: "full_name",
                header: "F.I.O",
                enableSorting: true,
            },
            {
                accessorKey: "phone_number",
                header: "Telefon raqami",
                enableSorting: true,
            },
            {
                accessorKey: "passport_series",
                header: "Passport seriyasi",
                enableSorting: true,
            },
            {
                accessorKey: "jshshir",
                header: "JShShIR",
                enableSorting: true,
            },
            {
                accessorKey: "warehouse",
                header: "Ombor",
                enableSorting: true,
            },
          
        ],
        [],
    )
}
