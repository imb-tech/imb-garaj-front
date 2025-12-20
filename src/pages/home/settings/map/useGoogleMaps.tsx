import { useEffect, useState } from "react"

const SCRIPT_ID = "google-maps-js"

export const useGoogleMaps = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window === "undefined") return
        if ((window as any).google?.maps) {
            setIsLoaded(true)
            return
        }

        const key = import.meta.env.VITE_GOOGLE_MAP_API_KEY as
            | string
            | undefined
        if (!key) {
            setLoadError("Missing VITE_GOOGLE_MAPS_API_KEY in env")
            return
        }
        const existing = document.getElementById(
            SCRIPT_ID,
        ) as HTMLScriptElement | null
        if (existing) {
            existing.addEventListener("load", () => setIsLoaded(true))
            existing.addEventListener("error", () =>
                setLoadError("Google Maps failed to load"),
            )
            return
        }

        const script = document.createElement("script")
        script.id = SCRIPT_ID
        script.async = true
        script.defer = true
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
            key,
        )}&libraries=places,geometry`

        script.onload = () => setIsLoaded(true)
        script.onerror = () => setLoadError("Google Maps failed to load")

        document.head.appendChild(script)
    }, [])

    return { isLoaded, loadError }
}
