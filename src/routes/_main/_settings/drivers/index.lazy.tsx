import { createLazyFileRoute } from '@tanstack/react-router'
import Drivers from '@/pages/home/settings/driver'
export const Route = createLazyFileRoute('/_main/_settings/drivers/')({
  component: Drivers,
})
