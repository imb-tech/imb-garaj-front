import LocationEditPage from "@/pages/home/settings/locations/location-edit"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/_settings/locations/$id")({
    component: LocationEditPage,
})
