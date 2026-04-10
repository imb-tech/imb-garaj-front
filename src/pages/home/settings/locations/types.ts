export type LocationItem = {
    id: number
    name: string
    type: "loading" | "unloading"
    polygon: {
        type: "Polygon"
        coordinates: number[][][]
    } | null
}
