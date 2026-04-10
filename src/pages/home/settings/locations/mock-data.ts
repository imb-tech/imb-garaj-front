import type { LocationItem } from "./types"

// TODO: Remove mock data when backend is ready
export const MOCK_LOCATIONS: LocationItem[] = [
    {
        id: 1,
        name: "Guangzhou Port",
        type: "loading",
        polygon: {
            type: "Polygon",
            coordinates: [
                [
                    [113.505, 23.095],
                    [113.525, 23.095],
                    [113.525, 23.115],
                    [113.505, 23.115],
                    [113.505, 23.095],
                ],
            ],
        },
    },
    {
        id: 2,
        name: "Shanghai Terminal",
        type: "loading",
        polygon: {
            type: "Polygon",
            coordinates: [
                [
                    [121.49, 31.22],
                    [121.52, 31.22],
                    [121.52, 31.25],
                    [121.49, 31.25],
                    [121.49, 31.22],
                ],
            ],
        },
    },
    {
        id: 3,
        name: "Toshkent Omborxona",
        type: "unloading",
        polygon: {
            type: "Polygon",
            coordinates: [
                [
                    [69.22, 41.3],
                    [69.25, 41.3],
                    [69.25, 41.32],
                    [69.22, 41.32],
                    [69.22, 41.3],
                ],
            ],
        },
    },
    {
        id: 4,
        name: "Samarqand Terminal",
        type: "unloading",
        polygon: {
            type: "Polygon",
            coordinates: [
                [
                    [66.94, 39.64],
                    [66.97, 39.64],
                    [66.97, 39.66],
                    [66.94, 39.66],
                    [66.94, 39.64],
                ],
            ],
        },
    },
    {
        id: 5,
        name: "Shenzhen Warehouse",
        type: "loading",
        polygon: {
            type: "Polygon",
            coordinates: [
                [
                    [114.05, 22.54],
                    [114.08, 22.54],
                    [114.08, 22.56],
                    [114.05, 22.56],
                    [114.05, 22.54],
                ],
            ],
        },
    },
    {
        id: 6,
        name: "Buxoro Sklad",
        type: "unloading",
        polygon: {
            type: "Polygon",
            coordinates: [
                [
                    [64.41, 39.76],
                    [64.44, 39.76],
                    [64.44, 39.78],
                    [64.41, 39.78],
                    [64.41, 39.76],
                ],
            ],
        },
    },
]
