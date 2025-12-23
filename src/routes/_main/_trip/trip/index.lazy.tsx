import ShiftStatisticMain from '@/pages/home/trip/trip-main'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_trip/trip/')({
  component: ShiftStatisticMain,
})
