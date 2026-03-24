import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/datatable"
import { formatMoney } from "@/lib/format-money"
import { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { useMemo } from "react"

type Transaction = {
    id: number
    amount: string
    full_name: string
    created_at: string
    comment: string
    type: number // 0 = Chiqim, 1 = Tushum
}

const fakeTransactions: Transaction[] = [
    { id: 1, amount: "50000000", full_name: "Husanboy Abdubannobov", created_at: "2026-03-23 09:33", comment: "kartaga", type: 0 },
    { id: 2, amount: "500000000", full_name: "Husanboy Abdubannobov", created_at: "2026-03-23 08:28", comment: "kotta kassadan", type: 1 },
    { id: 3, amount: "50000000", full_name: "Husanboy Abdubannobov", created_at: "2026-03-21 16:56", comment: "Javohir K Bugun", type: 0 },
    { id: 4, amount: "100000000", full_name: "Husanboy Abdubannobov", created_at: "2026-03-21 16:55", comment: "Bugun kotta kassa", type: 1 },
    { id: 5, amount: "300000000", full_name: "Husanboy Abdubannobov", created_at: "2026-03-21 16:40", comment: "Kotta kassa + Samarqand", type: 1 },
    { id: 6, amount: "200000000", full_name: "Husanboy Abdubannobov", created_at: "2026-03-18 20:30", comment: "Namangan", type: 1 },
    { id: 7, amount: "300000000", full_name: "Husanboy Abdubannobov", created_at: "2026-03-18 08:22", comment: "Kotta kassadan", type: 1 },
    { id: 8, amount: "75000000", full_name: "Sardor Karimov", created_at: "2026-03-17 14:10", comment: "Yoqilg'i uchun", type: 0 },
    { id: 9, amount: "150000000", full_name: "Jasur Mirzaev", created_at: "2026-03-16 11:45", comment: "Buxoro reysi", type: 1 },
    { id: 10, amount: "40000000", full_name: "Sardor Karimov", created_at: "2026-03-15 09:00", comment: "Ta'mirlash", type: 0 },
]

type AgentRow = {
    id: number
    full_name: string
    balance: string
}

const fakeAgents: AgentRow[] = [
    { id: 1, full_name: "Moliya", balance: "45 200 000" },
    { id: 2, full_name: "Agentlar", balance: "12 800 000" },
    { id: 3, full_name: "Plastik", balance: "8 500 000" },
    { id: 4, full_name: "Prastoy", balance: "3 200 000" },
]

const useTransactionCols = () => {
    return useMemo<ColumnDef<Transaction>[]>(
        () => [
            {
                header: "Summa",
                accessorKey: "amount",
                enableSorting: true,
                cell: ({ row }) => (
                    <span>
                        {formatMoney(Number(row.original.amount))} so'm
                    </span>
                ),
            },
            {
                header: "Ma'sul",
                accessorKey: "full_name",
                enableSorting: true,
            },
            {
                header: "Sana",
                accessorKey: "created_at",
                enableSorting: true,
            },
            {
                header: "Izoh",
                accessorKey: "comment",
                enableSorting: true,
            },
            {
                header: "Turi",
                accessorKey: "type",
                enableSorting: true,
                cell: ({ row }) => (
                    <Badge
                        variant={
                            Number(row.original.type) === 0
                                ? "destructive"
                                : "default"
                        }
                    >
                        {Number(row.original.type) === 0 ? "Chiqim" : "Tushum"}
                    </Badge>
                ),
            },
        ],
        [],
    )
}

const useAgentCols = () => {
    return useMemo<ColumnDef<AgentRow>[]>(
        () => [
            {
                header: "Agent",
                accessorKey: "full_name",
                enableSorting: true,
            },
            {
                header: "Balans",
                accessorKey: "balance",
                enableSorting: true,
            },
        ],
        [],
    )
}

const Kassa = () => {
    const transactionCols = useTransactionCols()
    const agentCols = useAgentCols()

    return (
        <div className="flex md:flex-row flex-col w-full gap-3">
            {/* Left sidebar */}
            <div className="space-y-3 md:max-w-sm w-full">
                <Card className="bg-muted/60">
                    <CardHeader className="space-y-0">
                        <CardTitle className="font-medium text-lg">
                            Asosiy Balans
                        </CardTitle>
                        <span>
                            <span className="text-xl font-semibold">
                                {formatMoney(172987400)}
                            </span>{" "}
                            <span className="text-base">so'm</span>
                        </span>
                    </CardHeader>
                    <CardContent className="pt-0 gap-3 w-full">
                        <div className="gap-3 mb-2 flex items-center justify-between">
                            <Button
                                variant="destructive"
                                type="button"
                                className="w-full"
                            >
                                <Plus size={20} />
                                Chiqim
                            </Button>
                            <Button type="button" className="w-full">
                                <Plus size={20} />
                                Balans To'ldirish
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <DataTable
                    numeration
                    data={fakeAgents}
                    columns={agentCols}
                    paginationProps={{ totalPages: 1 }}
                />

                <Card className="overflow-hidden relative bg-muted/60">
                    <CardHeader className="text-base sm:text-lg font-medium pb-0">
                        Balans ma'lumotlari
                    </CardHeader>
                    <CardContent className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                            <p className="max-w-[50%] text-muted-foreground">
                                Reyslar
                            </p>
                            <span>0 so'm</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="max-w-[50%] text-muted-foreground">
                                Agentlar:
                            </p>
                            <span>0 so'm</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right table */}
            <div className="w-full">
                <DataTable
                    numeration
                    columns={transactionCols}
                    data={fakeTransactions}
                    paginationProps={{ totalPages: 1 }}
                    head={
                        <div className="flex justify-between items-center gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg">Kiritilgan summa</h1>
                                <Badge>{fakeTransactions.length}</Badge>
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    )
}

export default Kassa
