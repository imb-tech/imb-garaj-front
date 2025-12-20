import Locations from '@/pages/home/settings/locations'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_settings/locations/')({
  component:Locations,
})
