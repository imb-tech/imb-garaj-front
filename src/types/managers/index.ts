type ManagerVehicles = {
    id: number
    truck_number: string
    truck_type: number
    driver_name: string
    pending_orders: number
    type: string
    status: number
}

type ManagerTrips = {
    id: number
    start: string
    end: string
    driver_name: string
    pending_order_count: number
    status: number
    loading: string
    unloading: string
    income: string
    cash_flow_sum: string
    vehicle:number
    driver:number
}

type ManagerOrdersPayments = {
    id: number
    order: number
    currency: number
    currency_course: string
    amount: string
    currency_amount: string
    payment_type: number
}

type ManagerOrders = {
    id: number
    loading: number
    loading_name: string
    unloading: number
    unloading_name: string
    cargo_type: number
    cargo_type_name: string
    date: string
    type: number
    status: number
    payment_amount: number
}
