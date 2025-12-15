import SvgMapUzb from "@/pages/dashboard/svg-map-uzb"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/dashboard")({
    component: SvgMapUzb,
})
