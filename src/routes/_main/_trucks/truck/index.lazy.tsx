import FinanceStatisticMain from "@/pages/home/finance/finance-main"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/_trucks/truck/")({
    component: FinanceStatisticMain,
})
