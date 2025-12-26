import ViewPage from '@/pages/home/truck-details/view'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_trucks/truck-detail/$id')({
  component: ViewPage,
})
