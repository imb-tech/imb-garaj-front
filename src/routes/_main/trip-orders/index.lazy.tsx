import TripOrders from '@/pages/home/trip-orders'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/trip-orders/')({
  component: TripOrders,
})
