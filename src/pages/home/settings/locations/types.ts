export type PolygonGeo = {
    type: "Polygon"
    coordinates: number[][][]
} | null

export type LocationFeature = {
    type: "Feature"
    geometry: {
        type: "Point"
        coordinates: [number, number]
    }
    properties: {
        id: number
        name: string
        address?: string | null
        polygon: {
            type: "Polygon"
            coordinates: number[][][]
        } | null
    }
}

export type LocationList = {
    type: "FeatureCollection"
    features: LocationFeature[]
}

export type LocationRequest = {
    type: "Feature"
    geometry: {
        type: "Point"
        coordinates: [number, number]
    }
    properties: {
        name: string
        address?: string | null
        polygon: {
            type: "Polygon"
            coordinates: number[][][]
        } | null
    }
}
