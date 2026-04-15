import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/datatable"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MANAGERS_CASHFLOW } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { formatMoney } from "@/lib/format-money"
import { formatDateTime } from "@/lib/format-date"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

type ExpenseRow = {
    id: number
    amount: number
    comment: string | null
    category_name: string
    payment_type_name: string
    created: string
    currency: number
    currency_course: string | null
    quantity: string | null
}

function formatAmount(row: ExpenseRow) {
    if (row.currency === 2 && row.currency_course) {
        const usd = Number(row.amount)
        const uzs = usd * Number(row.currency_course)
        return <>{formatMoney(usd)} USD (={formatMoney(uzs)} UZS)</>
    }
    return formatMoney(row.amount)
}

const useExpenseViewCols = () => {
    return useMemo<ColumnDef<ExpenseRow>[]>(
        () => [
            {
                header: "Kategoriya",
                accessorKey: "category_name",
                enableSorting: true,
            },
            {
                header: "Izoh",
                accessorKey: "comment",
                enableSorting: true,
                cell: ({ row }) => <span>{row.original.comment || "—"}</span>,
            },
            {
                header: "Summa",
                accessorKey: "amount",
                enableSorting: true,
                cell: ({ row }) => (
                    <span className="text-red-500 font-medium">
                        - {formatAmount(row.original)}
                    </span>
                ),
            },
            {
                header: "To'lov turi",
                accessorKey: "payment_type_name",
                enableSorting: true,
            },
            {
                header: "Sana",
                accessorKey: "created",
                enableSorting: true,
                cell: ({ row }) => <span>{formatDateTime(row.original.created)}</span>,
            },
        ],
        [],
    )
}

interface ExpenseDialogProps {
    tripId: number | null
    open: boolean
    onClose: () => void
}

export default function ExpenseDialog({ tripId, open, onClose }: ExpenseDialogProps) {
    const { data, isLoading } = useGet<ListResponse<ExpenseRow>>(
        MANAGERS_CASHFLOW,
        {
            params: { trip: tripId, action: -1, page_size: 100 },
            enabled: !!tripId && open,
        },
    )

    const rows = data?.results ?? []
    const columns = useExpenseViewCols()

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Xarajatlar ro'yxati
                        <Badge className="text-sm">{rows.length}</Badge>
                    </DialogTitle>
                </DialogHeader>
                <DataTable
                    columns={columns}
                    data={rows}
                    loading={isLoading}
                    numeration
                    viewAll
                />
            </DialogContent>
        </Dialog>
    )
}
