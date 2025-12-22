import ShiftStatisticMain from '@/pages/home/trip/trip-main'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_trip/trip/')({
  component: ShiftStatisticMain,
})
