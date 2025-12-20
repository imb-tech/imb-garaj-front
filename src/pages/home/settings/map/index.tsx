"use client"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useGoogleMaps } from "./useGoogleMaps"

export const MapComponent: React.FC<MapComponentProps> = ({
    coordinates,
    onCoordinatesChange,
    onAddressFilled,
    showSearch = true,
    showMapControls = true,
    showCurrentLocationBtn = true,
    searchPlaceholder = "Manzilni qidirish...",
    className = "",
    mapHeight = "400px",
}) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const markerRef = useRef<google.maps.Marker | null>(null)
    const mapInstanceRef = useRef<google.maps.Map | null>(null)
    const autocompleteServiceRef =
        useRef<google.maps.places.AutocompleteService | null>(null)
    const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
        null,
    )
    const searchInputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLDivElement>(null)

    const { isLoaded } = useGoogleMaps()
    const [isInitialized, setIsInitialized] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [suggestions, setSuggestions] = useState<
        google.maps.places.AutocompletePrediction[]
    >([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSelecting, setIsSelecting] = useState(false)
    const [hasUserSelected, setHasUserSelected] = useState(false)
    const [isGeocoding, setIsGeocoding] = useState(false)

    useEffect(() => {
        if (!isLoaded || !mapRef.current || isInitialized) return

        const initMap = () => {
            try {
                const map = new google.maps.Map(mapRef.current!, {
                    center: coordinates,
                    zoom: 17,
                    streetViewControl: false,
                    fullscreenControl: false,
                    mapTypeControl: false,
                    clickableIcons: false,
                })

                if (showMapControls) {
                    const mapTypeControlDiv = document.createElement("div")
                    mapTypeControlDiv.className =
                        "flex gap-1 bg-white p-1 rounded-md shadow-md"

                    const createMapTypeButton = (
                        text: string,
                        mapTypeId: string,
                    ) => {
                        const button = document.createElement("button")
                        button.textContent = text
                        button.className =
                            "px-2 py-1 text-xs font-medium rounded transition-colors hover:bg-gray-100"
                        button.style.minWidth = "80px"
                        button.onclick = () => map.setMapTypeId(mapTypeId)
                        return button
                    }

                    mapTypeControlDiv.appendChild(
                        createMapTypeButton("Xarita", "roadmap"),
                    )
                    mapTypeControlDiv.appendChild(
                        createMapTypeButton("Sun'iy yo'ldosh", "hybrid"),
                    )
                    map.controls[
                        google.maps.ControlPosition.BOTTOM_CENTER
                    ].push(mapTypeControlDiv)
                }

                const marker = new google.maps.Marker({
                    position: coordinates,
                    map,
                    draggable: true,
                    icon: {
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#FF3B30"/>
                                <path d="M12 12C13.1046 12 14 11.1046 14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12Z" fill="white"/>
                            </svg>
                        `)}`,
                        scaledSize: new google.maps.Size(40, 40),
                        anchor: new google.maps.Point(20, 40),
                    },
                })

                if (showSearch) {
                    autocompleteServiceRef.current =
                        new google.maps.places.AutocompleteService()
                    placesServiceRef.current =
                        new google.maps.places.PlacesService(
                            document.createElement("div"),
                        )
                }

                marker.addListener("dragend", () => {
                    const position = marker.getPosition()!
                    const newCoords = {
                        lat: position.lat(),
                        lng: position.lng(),
                    }
                    onCoordinatesChange(newCoords)
                    if (onAddressFilled) {
                        reverseGeocode(newCoords)
                    }
                    setHasUserSelected(true)
                })

                map.addListener("click", (event: google.maps.MapMouseEvent) => {
                    if (event.latLng) {
                        const newCoords = {
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng(),
                        }
                        marker.setPosition(newCoords)
                        onCoordinatesChange(newCoords)
                        if (onAddressFilled) {
                            reverseGeocode(newCoords)
                        }
                        setHasUserSelected(true)
                    }
                })

                markerRef.current = marker
                mapInstanceRef.current = map
                setIsInitialized(true)
            } catch (error) {
                console.error("Error initializing map:", error)
            }
        }

        initMap()
    }, [
        isLoaded,
        isInitialized,
        coordinates,
        onCoordinatesChange,
        showMapControls,
        showSearch,
        onAddressFilled,
    ])

    useEffect(() => {
        if (
            !showSearch ||
            !isLoaded ||
            !autocompleteServiceRef.current ||
            !searchQuery.trim() ||
            isSelecting ||
            hasUserSelected
        ) {
            setSuggestions([])
            return
        }

        const timer = setTimeout(() => {
            autocompleteServiceRef.current!.getPlacePredictions(
                {
                    input: searchQuery,
                    componentRestrictions: { country: "uz" },
                    types: ["geocode", "establishment"],
                },
                (predictions, status) => {
                    if (
                        status === google.maps.places.PlacesServiceStatus.OK &&
                        predictions
                    ) {
                        setSuggestions(predictions.slice(0, 5))
                        setShowSuggestions(true)
                    } else {
                        setSuggestions([])
                        setShowSuggestions(false)
                    }
                },
            )
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery, isLoaded, isSelecting, hasUserSelected, showSearch])

    const handlePlaceSelect = useCallback(
        (placeId: string) => {
            if (!showSearch || !isLoaded || !placesServiceRef.current) return

            setIsSelecting(true)
            setShowSuggestions(false)
            setHasUserSelected(true)

            placesServiceRef.current.getDetails(
                {
                    placeId: placeId,
                    fields: [
                        "geometry",
                        "address_components",
                        "formatted_address",
                        "name",
                    ],
                },
                (place, status) => {
                    setIsSelecting(false)
                    if (
                        status === google.maps.places.PlacesServiceStatus.OK &&
                        place?.geometry?.location
                    ) {
                        const newCoords = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng(),
                        }

                        if (markerRef.current && mapInstanceRef.current) {
                            markerRef.current.setPosition(newCoords)
                            mapInstanceRef.current.panTo(newCoords)
                        }

                        onCoordinatesChange(newCoords)

                        if (onAddressFilled) {
                            const addressData: AddressData = {
                                street: "",
                                city: "",
                                region: "",
                                fullAddress: place.formatted_address || "",
                            }

                            place.address_components?.forEach((component) => {
                                const types = component.types
                                if (types.includes("route"))
                                    addressData.street = component.long_name
                                if (types.includes("locality"))
                                    addressData.city = component.long_name
                                if (
                                    types.includes(
                                        "administrative_area_level_1",
                                    )
                                )
                                    addressData.region = component.long_name
                            })

                            onAddressFilled(addressData)
                        }

                        setSearchQuery(place.formatted_address || "")
                    }
                },
            )
        },
        [isLoaded, onCoordinatesChange, onAddressFilled, showSearch],
    )

    const reverseGeocode = useCallback(
        (coords: { lat: number; lng: number }) => {
            if (!onAddressFilled || !window.google || isGeocoding) return

            setIsGeocoding(true)
            const geocoder = new google.maps.Geocoder()

            geocoder.geocode({ location: coords }, (results, status) => {
                setIsGeocoding(false)
                if (status === "OK" && results?.[0]) {
                    const addressData: AddressData = {
                        street: "",
                        city: "",
                        region: "",
                        fullAddress: results[0].formatted_address ?? "",
                    }

                    results[0].address_components?.forEach((component) => {
                        const types = component.types
                        if (types.includes("route"))
                            addressData.street = component.long_name
                        if (types.includes("locality"))
                            addressData.city = component.long_name
                        if (types.includes("administrative_area_level_1"))
                            addressData.region = component.long_name
                    })

                    onAddressFilled(addressData)
                    if (!hasUserSelected && showSearch) {
                        setSearchQuery(results[0].formatted_address ?? "")
                    }
                }
            })
        },
        [hasUserSelected, isGeocoding, onAddressFilled, showSearch],
    )

    const handleGetCurrentLocation = useCallback(() => {
        if (!navigator.geolocation || !showCurrentLocationBtn) return

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                const newCoords = { lat: latitude, lng: longitude }

                if (markerRef.current && mapInstanceRef.current) {
                    markerRef.current.setPosition(newCoords)
                    mapInstanceRef.current.panTo(newCoords)
                }

                onCoordinatesChange(newCoords)
                if (onAddressFilled) {
                    reverseGeocode(newCoords)
                }
                setHasUserSelected(true)
            },
            (error) => {
                console.error("Geolocation error:", error)
            },
        )
    }, [
        onCoordinatesChange,
        reverseGeocode,
        showCurrentLocationBtn,
        onAddressFilled,
    ])

    useEffect(() => {
        if (!isInitialized || !markerRef.current || !mapInstanceRef.current)
            return

        const newPosition = new google.maps.LatLng(
            coordinates.lat,
            coordinates.lng,
        )
        markerRef.current.setPosition(newPosition)
        mapInstanceRef.current.panTo(newPosition)
    }, [coordinates.lat, coordinates.lng, isInitialized])

    useEffect(() => {
        if (!showSearch) return

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(target) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(target)
            ) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [showSearch])

    const handleSearchFocus = useCallback(() => {
        if (
            showSearch &&
            suggestions.length > 0 &&
            !isSelecting &&
            !hasUserSelected
        ) {
            setShowSuggestions(true)
        }
    }, [suggestions.length, isSelecting, hasUserSelected, showSearch])

    const clearSearch = useCallback(() => {
        setSearchQuery("")
        setSuggestions([])
        setShowSuggestions(false)
        setHasUserSelected(false)
    }, [])

    if (!isLoaded) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 text-sm">Xarita yuklanmoqda...</p>
            </div>
        )
    }

    return (
        <div
            className={`flex flex-col ${className}`}
            style={{ height: mapHeight }}
        >
            {showSearch && (
                <div className="relative mb-4" ref={suggestionsRef}>
                    <div className="relative">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                            fullWidth
                                ref={searchInputRef}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setHasUserSelected(false)
                                }}
                                onFocus={handleSearchFocus}
                                placeholder={searchPlaceholder}
                                className="h-10 text-sm"
                                disabled={isSelecting}
                            />
                            <div className="absolute right-0 top-0 h-full flex items-center gap-1 px-3">
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                                        disabled={isSelecting}
                                        aria-label="Tozalash"
                                    >
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </button>
                                )}
                                {showCurrentLocationBtn && (
                                    <button
                                        type="button"
                                        onClick={handleGetCurrentLocation}
                                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                                        title="Joriy joylashuv"
                                        disabled={isSelecting}
                                        aria-label="Joriy joylashuv"
                                    >
                                        <Navigation className="h-4 w-4 text-primary" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {showSuggestions &&
                        suggestions.length > 0 &&
                        !hasUserSelected && (
                            <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion.place_id}
                                        type="button"
                                        onClick={() =>
                                            handlePlaceSelect(
                                                suggestion.place_id,
                                            )
                                        }
                                        className="w-full text-left px-4 py-3 hover:bg-accent focus:bg-accent focus:outline-none text-sm border-b last:border-b-0 transition-colors"
                                        title={suggestion.description}
                                        disabled={isSelecting}
                                    >
                                        <div className="font-medium">
                                            {
                                                suggestion.structured_formatting
                                                    .main_text
                                            }
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                            {
                                                suggestion.structured_formatting
                                                    .secondary_text
                                            }
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                </div>
            )}
            <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                <div ref={mapRef} className="w-full h-full" />
            </div>
        </div>
    )
}
