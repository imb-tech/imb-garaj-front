import TripOrderDetailRow from '@/pages/home/truck-details/truck-trip-cashflows'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_trucks/orders/$id')({
  component: () =><TripOrderDetailRow/>,
})
