type VehicleType = {
    id: 1
    number: string
    trailer_number: string
}

type VehicleRoleType = {
    id: number
    name: string
    type: string
}

type VehicleCashflowsType = {
    id: number
    vehicle_number: string
    category_name: string
    comment: string
    vehicle: number
    executor: number
    transaction: number
    category: number
}
