import { createLazyFileRoute } from '@tanstack/react-router'
import ExpensesTypePage from '@/pages/home/settings/expenses-types'
export const Route = createLazyFileRoute('/_main/_settings/expense-types/')({
  component: ExpensesTypePage,
})
