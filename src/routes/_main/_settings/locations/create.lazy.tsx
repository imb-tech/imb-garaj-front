import LocationEditPage from "@/pages/home/settings/locations/location-edit"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/_settings/locations/create")({
    component: LocationEditPage,
})
