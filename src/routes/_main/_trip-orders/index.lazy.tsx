import TripOrders from '@/pages/home/trip-orders'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_trip-orders/')({
  component:TripOrders,
})

