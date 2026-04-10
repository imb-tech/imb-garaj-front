import { createLazyFileRoute } from "@tanstack/react-router"
import SecurityPage from "@/pages/home/security"

export const Route = createLazyFileRoute("/_main/_security/security/")({
    component: SecurityPage,
})
