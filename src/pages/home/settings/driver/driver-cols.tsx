import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const useColumnsDriverTable = () => {
    return useMemo<ColumnDef<DriversType>[]>(
        () => [
            {
                accessorKey: "first_name",
                header: "Ism",
                enableSorting: true,
            },
              {
                accessorKey: "last_name",
                header: "Ism",
                enableSorting: true,
               
            },
            {
                accessorKey: "phone",
                header: "Telefon raqami",
                enableSorting: true,
                accessorFn:(row)=>row.driver?.phone || "",
                cell:({row})=>{
                    return row.getValue("phone") || "-"
                },
                id:"phone"
                

            },
            {
                accessorKey: "username",
                header: "Login",
                enableSorting: true,
            },
            {
                header: "Passport seriyasi",
                enableSorting: true,
                accessorFn: (row) => row.driver?.passport_serial || "",
                cell: ({ row }) => {
                    return row.getValue("passport_number") || "-"
                },
                id: "passport_number",
            },
            {
                header: "JShShIR",
                enableSorting: true,
                accessorFn: (row) => row.driver?.pinfl || "",
                cell: ({ row }) => {
                    return row.getValue("pinfl") || "-"
                },
                id: "pinfl",
            },
            {
                header: "Haydovchilik guvohnomasi",
                enableSorting: true,
                accessorFn: (row) => row.driver?.driver_license || "",
                cell: ({ row }) => {
                    return row.getValue("driver_license") || "-"
                },
                id: "driver_license",
            },
            {
                header: "Ish staji",
                enableSorting: true,
                accessorFn: (row) => row.driver?.experience || 0,
                cell: ({ row }) => {
                    const value = row.getValue("work_experience")
                    return value ? `${value} yil` : "-"
                },
                id: "work_experience",
            },
            {
                header: "Litsenziya muddati",
                enableSorting: true,
                accessorFn: (row) => row.driver?.driver_license_date || "",
                cell: ({ row }) => {
                    const dateValue = row.getValue("license_expiry") as string
                    if (!dateValue) return "-"

                    const date = new Date(dateValue)
                    return date.toLocaleDateString("en-GB")
                },
                id: "license_expiry",
            },
        ],
        [],
    )
}
