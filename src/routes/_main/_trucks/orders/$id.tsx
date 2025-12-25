import TruckTripOrderMain from '@/pages/home/truck-details/truck-orders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_trucks/orders/$id')({
  component: () =><TruckTripOrderMain/>,
})
