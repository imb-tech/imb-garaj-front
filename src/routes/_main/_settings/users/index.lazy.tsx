import { createLazyFileRoute } from '@tanstack/react-router'
import UsersPage from '@/pages/home/settings/users'
export const Route = createLazyFileRoute('/_main/_settings/users/')({
  component: UsersPage,
})
