import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_main/_settings/locations/')({
  component: () => <div>Hello /_main/_settings/locations/!</div>,
})
