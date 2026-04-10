export type DriverStatus = "available" | "in_queue" | "loading" | "in_transit" | "unavailable"

export type ExcavatorStatus = "active" | "inactive" | "maintenance"

export type QueueDriver = {
    id: number
    name: string
    truck_number: string
    phone: string
    status: DriverStatus
    position: number | null
    excavator_id: number | null
    arrival_time: string | null
    location: string | null
}

export type Excavator = {
    id: number
    name: string
    number: string
    location: string
    status: ExcavatorStatus
    queue: QueueDriver[]
}

export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
    available: "Bo'sh",
    in_queue: "Navbatda",
    loading: "Yuklanmoqda",
    in_transit: "Yo'lda",
    unavailable: "Band",
}

export const DRIVER_STATUS_COLORS: Record<DriverStatus, string> = {
    available: "bg-green-500/10 text-green-600 border-transparent",
    in_queue: "bg-blue-500/10 text-blue-600 border-transparent",
    loading: "bg-orange-500/10 text-orange-500 border-transparent",
    in_transit: "bg-purple-500/10 text-purple-600 border-transparent",
    unavailable: "bg-gray-500/10 text-gray-500 border-transparent",
}

export const EXCAVATOR_STATUS_LABELS: Record<ExcavatorStatus, string> = {
    active: "Faol",
    inactive: "Faol emas",
    maintenance: "Ta'mirda",
}

export const EXCAVATOR_STATUS_COLORS: Record<ExcavatorStatus, string> = {
    active: "bg-green-500/10 text-green-600 border-transparent",
    inactive: "bg-gray-500/10 text-gray-500 border-transparent",
    maintenance: "bg-red-500/10 text-red-600 border-transparent",
}
