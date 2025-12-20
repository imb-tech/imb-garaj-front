import ShiftDetails from '@/pages/home/shift-details'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_shift/shift-detail/')({
  component:ShiftDetails,
})
