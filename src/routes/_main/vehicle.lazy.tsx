import { createLazyFileRoute } from '@tanstack/react-router'
import VehiclePage from '@/pages/home/vehicle'
export const Route = createLazyFileRoute('/_main/vehicle')({
  component: VehiclePage,
})
