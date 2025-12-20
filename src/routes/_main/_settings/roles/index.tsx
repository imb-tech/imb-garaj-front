import RolesPage from '@/pages/home/settings/roles'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_main/_settings/roles/')({
  component:RolesPage,
})
