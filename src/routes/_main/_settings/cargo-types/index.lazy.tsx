import { createLazyFileRoute } from '@tanstack/react-router'
import CargoPage from '@/pages/home/settings/cargo-types/cargo-cols'
export const Route = createLazyFileRoute('/_main/_settings/cargo-types/')({
  component:  CargoPage,
})
