import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
    DrawingManager,
    GoogleMap,
    LoadScript,
    Polygon,
} from "@react-google-maps/api"
import { Navigation, Plus, Trash } from "lucide-react"
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react"

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY
const LIBRARIES: ("drawing" | "places")[] = ["drawing", "places"]
const DEFAULT_CENTER = { lat: 39.6542, lng: 66.9597 } // Uzbekistan
const DEFAULT_ZOOM = 6

const containerStyle = {
    width: "100%",
    height: "55vh",
    borderRadius: 10,
} as const

export type LocationMapRef = {
    clearPolygons: () => void
    setPolygonsFromData: (
        polygon: {
            type: "Polygon"
            coordinates: number[][][]
        } | null,
    ) => void
}

type PolygonGeo = {
    type: "Polygon"
    coordinates: number[][][]
} | null

type Props = {
    onPolygonChange: (polygon: PolygonGeo) => void
    defaultPolygon?: PolygonGeo
}

const closePolygon = (path: google.maps.LatLngLiteral[]) => {
    if (!path.length) return path
    const first = path[0]
    const last = path[path.length - 1]
    if (first.lat !== last.lat || first.lng !== last.lng)
        return [...path, first]
    return path
}

const LocationMap = forwardRef<LocationMapRef, Props>(
    function LocationMapComponent({ onPolygonChange, defaultPolygon }, ref) {
        const mapRef = useRef<google.maps.Map | null>(null)
        const [polygonPaths, setPolygonPaths] = useState<
            google.maps.LatLngLiteral[][]
        >([])
        const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
        const [polygonMode, setPolygonMode] = useState(false)
        const [mapLoaded, setMapLoaded] = useState(false)

        const [query, setQuery] = useState("")
        const [searchResults, setSearchResults] = useState<
            google.maps.places.AutocompletePrediction[]
        >([])

        const polyStoreRef = useRef<
            Record<
                number,
                {
                    poly?: google.maps.Polygon
                    listeners: google.maps.MapsEventListener[]
                }
            >
        >({})

        const clearListeners = (i: number) => {
            const store = polyStoreRef.current[i]
            if (!store) return
            store.listeners.forEach((l) => l.remove())
            store.listeners = []
        }

        const savePolygonsToForm = useCallback(
            (paths: google.maps.LatLngLiteral[][]) => {
                if (paths.length === 0) {
                    onPolygonChange(null)
                    return
                }
                const geo = {
                    type: "Polygon" as const,
                    coordinates: paths.map((p) =>
                        closePolygon(p).map((pt) => [pt.lng, pt.lat]),
                    ),
                }
                onPolygonChange(geo)
            },
            [onPolygonChange],
        )

        const updatePolygonAt = useCallback(
            (index: number, path: google.maps.LatLngLiteral[]) => {
                setPolygonPaths((prev) => {
                    const next = prev.map((p, i) => (i === index ? path : p))
                    savePolygonsToForm(next)
                    return next
                })
            },
            [savePolygonsToForm],
        )

        const syncAllFromInstances = useCallback(() => {
            const next: google.maps.LatLngLiteral[][] = polygonPaths.map(
                (fallback, i) => {
                    const poly = polyStoreRef.current[i]?.poly
                    if (!poly) return fallback
                    return poly
                        .getPath()
                        .getArray()
                        .map((ll) => ({ lat: ll.lat(), lng: ll.lng() }))
                },
            )
            setPolygonPaths(next)
            savePolygonsToForm(next)
        }, [polygonPaths, savePolygonsToForm])

        const addPolygon = useCallback(
            (path: google.maps.LatLngLiteral[]) => {
                setPolygonPaths((prev) => {
                    const next = [...prev, path]
                    savePolygonsToForm(next)
                    return next
                })
                setSelectedIndex(polygonPaths.length)
            },
            [savePolygonsToForm, polygonPaths.length],
        )

        const clearAllPolygons = useCallback(() => {
            setPolygonPaths([])
            setSelectedIndex(null)
            onPolygonChange(null)
            Object.keys(polyStoreRef.current).forEach((k) =>
                clearListeners(Number(k)),
            )
            polyStoreRef.current = {}
        }, [onPolygonChange])

        const deleteSelected = useCallback(() => {
            setPolygonPaths((prev) => {
                if (selectedIndex === null) return prev
                clearListeners(selectedIndex)
                const next = prev.filter((_, i) => i !== selectedIndex)
                if (next.length > 0) savePolygonsToForm(next)
                else onPolygonChange(null)
                return next
            })
            const inst = polyStoreRef.current[selectedIndex ?? -1]?.poly
            inst?.setMap(null)
            delete polyStoreRef.current[selectedIndex ?? -1]
            setSelectedIndex(null)
        }, [selectedIndex, savePolygonsToForm, onPolygonChange])

        const bindPathListeners = useCallback(
            (i: number, polygon: google.maps.Polygon) => {
                polyStoreRef.current[i] = polyStoreRef.current[i] || {
                    poly: polygon,
                    listeners: [],
                }
                polyStoreRef.current[i].poly = polygon
                clearListeners(i)

                const path = polygon.getPath()
                const sync = () => {
                    const newPath = path
                        .getArray()
                        .map((ll) => ({ lat: ll.lat(), lng: ll.lng() }))
                    updatePolygonAt(i, newPath)
                }

                const l1 = path.addListener("set_at", sync)
                const l2 = path.addListener("insert_at", sync)
                const l3 = path.addListener("remove_at", sync)
                const l4 = polygon.addListener("dragend", () =>
                    syncAllFromInstances(),
                )

                polyStoreRef.current[i].listeners.push(l1, l2, l3, l4)
            },
            [updatePolygonAt, syncAllFromInstances],
        )

        const handlePolygonComplete = useCallback(
            (polygon: google.maps.Polygon) => {
                const path = polygon
                    .getPath()
                    .getArray()
                    .map((ll) => ({ lat: ll.lat(), lng: ll.lng() }))
                addPolygon(path)
                polygon.setMap(null)
                setPolygonMode(false)
            },
            [addPolygon],
        )

        const goToMyLocation = () => {
            if (navigator.geolocation && mapRef.current) {
                navigator.geolocation.getCurrentPosition((pos) => {
                    mapRef.current?.panTo({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    })
                    mapRef.current?.setZoom(15)
                })
            }
        }

        const runSearch = useCallback(() => {
            if (!query.trim()) {
                setSearchResults([])
                return
            }
            const service = new google.maps.places.AutocompleteService()
            service.getPlacePredictions(
                { input: query, language: "uz" },
                (predictions) => {
                    if (predictions) setSearchResults(predictions)
                },
            )
        }, [query])

        const handlePickSearchResult = useCallback(
            (res: google.maps.places.AutocompletePrediction) => {
                const service = new google.maps.places.PlacesService(
                    mapRef.current as google.maps.Map,
                )
                service.getDetails({ placeId: res.place_id }, (place) => {
                    if (place?.geometry?.location) {
                        mapRef.current?.panTo({
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        })
                        mapRef.current?.setZoom(15)
                        setSearchResults([])
                        setQuery("")
                    }
                })
            },
            [],
        )

        const getPolyOptions = (
            selected: boolean,
        ): google.maps.PolygonOptions => ({
            fillColor: selected ? "#2563eb" : "#FAA533",
            fillOpacity: selected ? 0.35 : 0.2,
            strokeColor: selected ? "#1d4ed8" : "#FAA533",
            strokeOpacity: selected ? 0.9 : 0.8,
            strokeWeight: selected ? 2 : 1,
            clickable: true,
            editable: selected,
            draggable: selected,
            zIndex: selected ? 2 : 1,
        })

        useImperativeHandle(
            ref,
            () => ({
                clearPolygons: clearAllPolygons,
                setPolygonsFromData: (polygon) => {
                    clearAllPolygons()
                    if (!polygon?.coordinates?.length) return
                    const paths = polygon.coordinates.map((ring) => {
                        const mapped = ring.map(([lng, lat]) => ({ lat, lng }))
                        if (
                            mapped.length > 1 &&
                            mapped[0].lat === mapped[mapped.length - 1].lat &&
                            mapped[0].lng === mapped[mapped.length - 1].lng
                        ) {
                            mapped.pop()
                        }
                        return mapped
                    })
                    setPolygonPaths(paths)

                    if (mapRef.current && paths[0]?.length) {
                        const bounds = new google.maps.LatLngBounds()
                        paths[0].forEach((p) => bounds.extend(p))
                        mapRef.current.fitBounds(bounds, 80)
                    }
                },
            }),
            [clearAllPolygons],
        )

        // Load default polygon when map is ready
        const defaultApplied = useRef(false)
        useEffect(() => {
            if (!mapLoaded || defaultApplied.current || !defaultPolygon?.coordinates?.length) return
            defaultApplied.current = true
            const paths = defaultPolygon.coordinates.map((ring) => {
                const mapped = ring.map(([lng, lat]) => ({ lat, lng }))
                if (
                    mapped.length > 1 &&
                    mapped[0].lat === mapped[mapped.length - 1].lat &&
                    mapped[0].lng === mapped[mapped.length - 1].lng
                ) {
                    mapped.pop()
                }
                return mapped
            })
            setPolygonPaths(paths)
            if (mapRef.current && paths[0]?.length) {
                const bounds = new google.maps.LatLngBounds()
                paths[0].forEach((p) => bounds.extend(p))
                mapRef.current.fitBounds(bounds, 80)
            }
        }, [mapLoaded, defaultPolygon])

        // Push controls into map when in fullscreen
        const searchPanelRef = useRef<HTMLDivElement | null>(null)
        const buttonsPanelRef = useRef<HTMLDivElement | null>(null)

        useEffect(() => {
            if (!mapRef.current || !mapLoaded) return
            const map = mapRef.current
            if (searchPanelRef.current)
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(
                    searchPanelRef.current,
                )
            if (buttonsPanelRef.current)
                map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
                    buttonsPanelRef.current,
                )
            return () => {
                if (searchPanelRef.current) {
                    const arr = map.controls[
                        google.maps.ControlPosition.TOP_LEFT
                    ].getArray()
                    const idx = arr.indexOf(searchPanelRef.current)
                    if (idx > -1)
                        map.controls[
                            google.maps.ControlPosition.TOP_LEFT
                        ].removeAt(idx)
                }
                if (buttonsPanelRef.current) {
                    const arr = map.controls[
                        google.maps.ControlPosition.RIGHT_TOP
                    ].getArray()
                    const idx = arr.indexOf(buttonsPanelRef.current)
                    if (idx > -1)
                        map.controls[
                            google.maps.ControlPosition.RIGHT_TOP
                        ].removeAt(idx)
                }
            }
        }, [mapLoaded])

        return (
            <div className="relative border rounded-xl overflow-hidden">
                <LoadScript
                    googleMapsApiKey={GOOGLE_MAPS_KEY}
                    libraries={LIBRARIES}
                >
                    <GoogleMap
                        onLoad={(map) => {
                            mapRef.current = map
                            map.setCenter(DEFAULT_CENTER)
                            map.setZoom(DEFAULT_ZOOM)
                            setMapLoaded(true)
                        }}
                        onClick={() => setSelectedIndex(null)}
                        mapContainerStyle={containerStyle}
                        options={{
                            streetViewControl: false,
                            fullscreenControl: true,
                            fullscreenControlOptions: {
                                position:
                                    window.google?.maps?.ControlPosition
                                        ?.TOP_RIGHT,
                            },
                        }}
                    >
                        {polygonPaths.map((path, i) => {
                            const selected = selectedIndex === i
                            return (
                                <Polygon
                                    key={i}
                                    options={getPolyOptions(selected)}
                                    onClick={(e) => {
                                        if (
                                            (e as any)?.domEvent
                                                ?.stopPropagation
                                        )
                                            (e as any).domEvent.stopPropagation()
                                        setSelectedIndex((cur) =>
                                            cur === i ? null : i,
                                        )
                                    }}
                                    onLoad={(polygon) => {
                                        polyStoreRef.current[i] =
                                            polyStoreRef.current[i] || {
                                                poly: polygon,
                                                listeners: [],
                                            }
                                        polyStoreRef.current[i].poly = polygon
                                        polygon.setPath(path)
                                        bindPathListeners(i, polygon)
                                    }}
                                    onUnmount={() => {
                                        clearListeners(i)
                                        delete polyStoreRef.current[i]
                                    }}
                                    onDragEnd={syncAllFromInstances}
                                />
                            )
                        })}

                        {polygonMode && (
                            <DrawingManager
                                onPolygonComplete={handlePolygonComplete}
                                options={{
                                    drawingControl: false,
                                    drawingMode:
                                        "polygon" as google.maps.drawing.OverlayType,
                                    polygonOptions: {
                                        fillColor: "#FAA533",
                                        fillOpacity: 0.35,
                                        strokeColor: "#FAA533",
                                        strokeOpacity: 0.9,
                                        strokeWeight: 2,
                                        clickable: true,
                                        editable: true,
                                        zIndex: 2,
                                    },
                                }}
                            />
                        )}
                    </GoogleMap>
                </LoadScript>

                {/* Search panel */}
                <div
                    ref={searchPanelRef}
                    className="bg-white dark:bg-zinc-900 rounded-xl shadow p-0.5 m-2"
                    style={{ minWidth: 300, maxWidth: 400 }}
                >
                    <div className="flex gap-2">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && runSearch()}
                            placeholder="Manzilni yozing..."
                            className="w-full text-sm py-0"
                            fullWidth
                        />
                        <Button type="button" onClick={runSearch} size="sm">
                            Qidirish
                        </Button>
                    </div>
                    {searchResults.length > 0 && (
                        <ul className="mt-2 max-h-56 overflow-auto rounded-lg border divide-y bg-white dark:bg-zinc-950">
                            {searchResults.map((r) => (
                                <li
                                    key={r.place_id}
                                    className="p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                    onClick={() => handlePickSearchResult(r)}
                                >
                                    {r.description}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Control buttons */}
                <div ref={buttonsPanelRef} className="flex flex-col gap-2 m-2">
                    <button
                        onClick={() =>
                            selectedIndex !== null
                                ? deleteSelected()
                                : clearAllPolygons()
                        }
                        title={
                            selectedIndex !== null
                                ? "Tanlangan polygonni o'chirish"
                                : "Hammasini tozalash"
                        }
                        className="h-10 w-10 flex items-center justify-center rounded shadow-md bg-white text-black hover:bg-zinc-100 cursor-pointer"
                        type="button"
                    >
                        <Trash size={20} />
                    </button>
                    <button
                        onClick={() => setPolygonMode(true)}
                        className={cn(
                            "h-10 w-10 flex items-center justify-center rounded shadow-md bg-white text-black hover:bg-zinc-100 cursor-pointer",
                            polygonMode &&
                                "bg-orange-500 text-white hover:bg-orange-600",
                        )}
                        type="button"
                    >
                        <Plus size={20} />
                    </button>
                    <button
                        onClick={goToMyLocation}
                        className="h-10 w-10 flex items-center justify-center rounded shadow-md bg-white text-black hover:bg-zinc-100 cursor-pointer"
                        type="button"
                    >
                        <Navigation size={20} />
                    </button>
                </div>
            </div>
        )
    },
)

export default LocationMap
