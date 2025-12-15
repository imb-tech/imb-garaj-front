import { TransportMain } from "@/pages/home/transport"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/transport")({
    component: TransportMain,
})
