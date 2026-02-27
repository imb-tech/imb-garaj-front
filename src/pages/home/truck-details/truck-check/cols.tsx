import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useMemo } from "react"

export const useCostCols = () => {
    return useMemo<ColumnDef<any>[]>(
        () => [
         {
                header: "Sana",
                accessorKey: "created",
                enableSorting: true,
                cell: ({ getValue }) => (
                    <span>
                        {getValue<string>() ?
                            format(
                                new Date(getValue<string>()),
                                "dd.MM.yyyy HH:mm",
                            )
                        :   "—"}
                    </span>
                ),
            },
            {
                header: "Miqdor",
                accessorKey: "amount",
                cell: ({ getValue }) => {
                    const value = getValue<string>()
                    if (!value) return <span className="">—</span>

                    const num = Number(value)
                    if (isNaN(num)) return <span className="">{value}</span>

                    return (
                        <div className="min-w-[100px]">
                            {num.toLocaleString("uz-UZ").replace(/,/g, " ")}
                        </div>
                    )
                },
            },
         

            {
                header: "Texnika",
                accessorKey: "technic",
                cell: ({ getValue }) => <span>{getValue<number>()}</span>,
            },
      
            {
                header: "Qachongacha",
                accessorKey: "end_time",
                enableSorting: true,
                cell: ({ getValue }) => (
                    <span>
                        {getValue<string>() ?
                            format(
                                new Date(getValue<string>()),
                                "dd.MM.yyyy HH:mm",
                            )
                        :   "—"}
                    </span>
                ),
            },
        ],
        [],
    )
}


