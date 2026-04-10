import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/_security")({
    component: SecurityLayout,
})

function SecurityLayout() {
    return <Outlet />
}

export default SecurityLayout
