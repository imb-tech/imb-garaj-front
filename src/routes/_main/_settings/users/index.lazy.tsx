import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_settings/users/')({
  component: () => <div>Hello /_main/_settings/users/!</div>,
})
