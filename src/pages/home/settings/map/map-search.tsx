import { useState,useEffect,useRef,useCallback } from "react"
import { toast } from "sonner"
import { Navigation,X,MapPin } from "lucide-react"

interface MapSearchProps {
    onCoordinatesChange: (coords: [string, string]) => void
    onAddressFilled: (address: string) => void
    initialCoordinates?: [string, string]
    initialAddress?: string
}

 export const MapSearch: React.FC<MapSearchProps> = ({
    onCoordinatesChange,
    onAddressFilled,
    initialCoordinates = ["", ""],
    initialAddress = "",
}) => {
    const [searchQuery, setSearchQuery] = useState(initialAddress)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSelecting, setIsSelecting] = useState(false)
    const [hasSelected, setHasSelected] = useState(false) 
    const autocompleteServiceRef = useRef<any>(null)
    const placesServiceRef = useRef<any>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const suggestionsRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (!window.google || !window.google.maps) {
            const loadScript = () => {
                const script = document.createElement('script')
                script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAP_API_KEY}&libraries=places&language=uz&region=UZ`
                script.async = true
                script.defer = true
                document.head.appendChild(script)
                script.onload = initializeServices
            }
            
            if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
                loadScript()
            } else {
                if (window.google?.maps?.places) {
                    initializeServices()
                }
            }
        } else {
            initializeServices()
        }

        function initializeServices() {
            if (window.google?.maps?.places) {
                autocompleteServiceRef.current = new google.maps.places.AutocompleteService()
                placesServiceRef.current = new google.maps.places.PlacesService(
                    document.createElement("div")
                )
            }
        }
    }, [])

    useEffect(() => {
        if (!autocompleteServiceRef.current || !searchQuery.trim() || isSelecting || hasSelected) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        const timer = setTimeout(() => {
            autocompleteServiceRef.current.getPlacePredictions(
                {
                    input: searchQuery,
                    componentRestrictions: { country: "uz" },
                    types: ["geocode", "establishment"],
                },
                (predictions: any, status: any) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                        setSuggestions(predictions.slice(0, 5))
                        setShowSuggestions(true)
                    } else {
                        setSuggestions([])
                        setShowSuggestions(false)
                    }
                }
            )
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery, isSelecting, hasSelected]) 

    const handlePlaceSelect = useCallback((placeId: string) => {
        if (!placesServiceRef.current) return

        setIsSelecting(true)
        setShowSuggestions(false)
        setHasSelected(true) 

        placesServiceRef.current.getDetails(
            {
                placeId: placeId,
                fields: ["geometry", "formatted_address", "name"],
            },
            (place: any, status: any) => {
                setIsSelecting(false)
                if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
                    const coords: [string, string] = [
                        place.geometry.location.lat().toString(),
                        place.geometry.location.lng().toString(),
                    ]
                    
                    const address = place.formatted_address || place.name || ""
                    
                    onCoordinatesChange(coords)
                    onAddressFilled(address)
                    setSearchQuery(address)
                }
            }
        )
    }, [onCoordinatesChange, onAddressFilled])

    const handleGetCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            toast.error("Geolokatsiya qo'llab-quvvatlanmaydi")
            return
        }

        setIsSelecting(true)
        setShowSuggestions(false)
        setHasSelected(true) 
        toast.info("Joylashuv aniqlanmoqda...")
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords: [string, string] = [
                    position.coords.latitude.toString(),
                    position.coords.longitude.toString(),
                ]
                
                if (window.google?.maps) {
                    const geocoder = new google.maps.Geocoder()
                    geocoder.geocode(
                        { location: { lat: position.coords.latitude, lng: position.coords.longitude } },
                        (results, status) => {
                            setIsSelecting(false)
                            if (status === "OK" && results?.[0]) {
                                const address = results[0].formatted_address
                                onAddressFilled(address)
                                setSearchQuery(address)
                            } else {
                                setSearchQuery(`${coords[0]}, ${coords[1]}`)
                            }
                            onCoordinatesChange(coords)
                        }
                    )
                } else {
                    setIsSelecting(false)
                    setSearchQuery(`${coords[0]}, ${coords[1]}`)
                    onCoordinatesChange(coords)
                }
            },
            (error) => {
                setIsSelecting(false)
                toast.error("Joylashuvni aniqlashda xatolik")
                console.error("Geolocation error:", error)
            }
        )
    }, [onCoordinatesChange, onAddressFilled])

    useEffect(() => {
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
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSearchFocus = useCallback(() => {
        if (suggestions.length > 0 && !isSelecting && !hasSelected) {
            setShowSuggestions(true)
        }
    }, [suggestions.length, isSelecting, hasSelected])

    const clearSearch = useCallback(() => {
        setSearchQuery("")
        setSuggestions([])
        setShowSuggestions(false)
        setHasSelected(false) 
        onCoordinatesChange(["", ""])
        onAddressFilled("")
    }, [onCoordinatesChange, onAddressFilled])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setHasSelected(false) 
    }, [])

    useEffect(() => {
        if (initialCoordinates[0] && initialCoordinates[1] && initialAddress) {
            setHasSelected(true)
        }
    }, [initialCoordinates, initialAddress])

    return (
        <div className="space-y-2" ref={suggestionsRef}>
            <label className="text-sm font-medium leading-none">
                Manzilni qidirish yoki xaritadan tanlash
            </label>
            
            <div className="relative">
                <div className="relative">
                    <input
                        ref={searchInputRef}
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleSearchFocus}
                        placeholder="Manzilni kiriting yoki joylashuv orqali toping..."
                        className="w-full h-10 px-3 pl-10 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isSelecting}
                    />

                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                    </div>

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            disabled={isSelecting}
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                        title="Joriy joylashuv"
                        disabled={isSelecting}
                    >
                        <Navigation className="w-4 h-4 text-blue-600" />
                    </button>
                </div>

                {showSuggestions && suggestions.length > 0 && !hasSelected && (
                    <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion.place_id}
                                type="button"
                                onClick={() => handlePlaceSelect(suggestion.place_id)}
                                className="w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-gray-700 text-sm border-b border-gray-100 last:border-b-0 truncate transition-colors"
                                title={suggestion.description}
                            >
                                <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                                <div className="text-xs text-gray-500 mt-0.5 truncate">
                                    {suggestion.structured_formatting.secondary_text}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            
        </div>
    )
}