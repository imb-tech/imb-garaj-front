import { createLazyFileRoute } from '@tanstack/react-router'
import VehicleTypePage from '@/pages/home/settings/vehicle-types'
export const Route = createLazyFileRoute('/_main/_settings/vehicle-types/')({
  component: VehicleTypePage,
})
