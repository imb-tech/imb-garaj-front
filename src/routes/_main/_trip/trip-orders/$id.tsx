import TripOrders from '@/pages/home/trip-orders'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_trip/trip-orders/$id')({
  component:TripOrders,
  validateSearch: () => ({}),
})
