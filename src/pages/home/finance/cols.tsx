import { CopyButton } from "@/lib/copy-button"
import { ColumnDef } from "@tanstack/react-table"
import { Truck } from "lucide-react"
import { useMemo } from "react"

export const useCostCols = () => {
    return useMemo<ColumnDef<any>[]>(
        () => [
            {
                header: "Transport ID",
                accessorKey: "author_name",
                enableSorting: true,
                cell: ({ row }) => <span>{CopyButton(4731)}</span>,
            },
            {
                header: "Avtoraqam",
                accessorKey: "author_name",
                enableSorting: true,
                cell: ({ row }) => <span>01 369 JKA</span>,
            },
             {
                header: "Transport turi",
                accessorKey: "author_name",
                enableSorting: true,
                cell: ({ row }) => <span>Fura</span>,
            },
            {
                header: "Haydovchi",
                accessorKey: "date",
                enableSorting: true,
                cell: ({ row }) => <span>Haydovchi</span>,
            },
            {
                header: "Reyslar soni",
                accessorKey: "body",
                enableSorting: true,
                cell: ({ row }) => <span>4</span>,
            },
            {
                header: "Masofa",
                accessorKey: "created_at",
                enableSorting: true,
                cell: ({ row }) => <span>170 km</span>,
            },
            {
                header: "100 km / litr",
                accessorKey: "created_at",
                enableSorting: true,
                cell: ({ row }) => <span>25 litr</span>,
            },
            {
                header: "Probeg",
                accessorKey: "created_at",
                enableSorting: true,
                cell: ({ row }) => <span>170 000 km</span>,
            },

            {
                header: "Tushim",
                accessorKey: "created_at",
                enableSorting: true,
                cell: ({ row }) => <span>1 500 000</span>,
            },

            {
                header: "Xarajatlar",
                accessorKey: "created_at",
                enableSorting: true,
                cell: ({ row }) => <span>-1 200 000</span>,
            },
            {
                header: "Foyda",
                accessorKey: "status",
                enableSorting: true,
                cell: ({ row }) => (
                    <span>100 000 so'm</span>
                ),
            },
        ],
        [],
    )
}
