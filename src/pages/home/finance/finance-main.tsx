import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/ui/datatable"
import { useGet } from "@/hooks/useGet"
import { formatMoney } from "@/lib/format-money"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { CreditCard, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { useCostCols } from "./cols"
import FinanceCard from "./finance-card"
import ReportsFilter from "../truck-details/filter"

type CardMain = {
    current_balance: number
    current_balance_perc: number
    difference: number
    difference_perc: number
    expenses: number
    expense_perc: number
    incomes: number
    income_perc: number
}

const FinanceStatisticMain = () => {
    const search: any = useSearch({ strict: false })
    const navigate = useNavigate()

    const { data: dataCard } = useGet<CardMain>("", {
        params: search,
        options: { enabled: !!search?.branch },
    })

    const cardData = [
        {
            title: "Jami Daromad",
            value: formatMoney(120000000),
            change: !!dataCard?.income_perc && `+ ${dataCard?.income_perc} %`,
            icon: <TrendingUp className="h-4 w-4 " />,
            bgColor: "bg-green-100/70 dark:bg-green-900/30",
            iconLarge: <TrendingUp className="h-24 w-24 text-green-300" />,
            badgeBg: "bg-green-200 dark:bg-green-900/40",
            textColor: "text-green-600 dark:text-green-400",
            status: "incomes",
        },
        {
            title: "Jami Xarajatlar",
            value: formatMoney(3000000),
            change: !!dataCard?.expense_perc && `- ${dataCard?.expense_perc} %`,
            icon: <TrendingDown className="h-4 w-4" />,
            bgColor: "bg-orange-100/70 dark:bg-orange-900/30",
            iconLarge: <TrendingDown className="h-24 w-24 text-orange-300" />,
            badgeBg: "bg-orange-200 dark:bg-orange-900/40",
            textColor: "text-orange-600 dark:text-orange-400",
            status: "expenses",
        },
        {
            title: "Sof Foyda",
            value: formatMoney(90000000),
            change:
                !!dataCard?.difference_perc &&
                `+ ${dataCard?.difference_perc} %`,
            icon: <DollarSign className="h-4 w-4 " />,
            bgColor: "bg-purple-100/70 dark:bg-purple-900/30",
            iconLarge: <DollarSign className="h-24 w-24 text-purple-300" />,
            badgeBg: "bg-purple-200 dark:bg-purple-900/40",
            textColor: "text-purple-600 dark:text-purple-400",
            status: "difference",
        },
        {
            title: "Hisob Balansi",
            value: formatMoney(250000000),
            change:
                !!dataCard?.current_balance_perc &&
                `+ ${dataCard?.current_balance_perc} %`,
            icon: <CreditCard className="h-4 w-4 " />,
            bgColor: "bg-blue-100/70 dark:bg-blue-900/30",
            iconLarge: <CreditCard className="h-24 w-24 text-blue-300" />,
            badgeBg: "bg-blue-200 dark:bg-blue-900/40",
            textColor: "text-blue-700 dark:text-blue-400",
            status: "balance",
        },
    ]

    const columns = useCostCols()
    return (
        <div className="space-y-3">
            <div className="flex sm:justify-end mb-3 ">
                <ReportsFilter />
            </div>
            <Card className="w-full mb-3">
                <CardContent>
                    <h3 className="text-lg font-semibold mb-4">
                        Moliyaviy Ko'rsatkichlar
                    </h3>

                    <div className="overflow-x-auto no-scrollbar p-1">
                        <div className="grid grid-cols-[repeat(4,300px)] md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {cardData.map((card, idx) => (
                                <FinanceCard key={idx} data={card} />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <DataTable
                columns={columns}
                data={[
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                ]}
                numeration
                onRowClick={() =>
                    navigate({ to: "/truck-detail/$id", params: { id: "2" } })
                }
                head={
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-xl">{`Transportlar ro'yxati`}</h1>
                        <Badge className="text-sm">{formatMoney(25)}</Badge>
                    </div>
                }
                paginationProps={{
                    totalPages: 2,
                }}
            />
        </div>
    )
}

export default FinanceStatisticMain
