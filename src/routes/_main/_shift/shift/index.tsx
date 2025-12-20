import ShiftStatisticMain from '@/pages/home/shift/shift-main'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_shift/shift/')({
  component:ShiftStatisticMain,
})
