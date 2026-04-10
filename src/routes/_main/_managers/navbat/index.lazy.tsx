import { createLazyFileRoute } from "@tanstack/react-router"
import NavbatPage from "@/pages/home/managers/navbat"

export const Route = createLazyFileRoute("/_main/_managers/navbat/")({
    component: NavbatPage,
})
