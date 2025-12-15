

type Place = {
    name: string
    id: number
    code: number
    long: string
    lat: string
    viloyat: string
    status: number
}

type Car = { id: number; option_name: string; type: string }



type MyOffer = {
    id: number;
    code: string;
    status: number;
    client_code: string;
    loading_name: string;
    unloading_name: string;
    truck_number: string;
    phone_number: string;
    created_at: string;
    date: string
    truck_id: string
    is_blocked: boolean
    amount: number
};






type Status = {
    must_check: boolean
    agent: null | number
    card: number
    cash: number
    code: string
    comment: string
    company_code: number
    departure_point: string
    destination: string
    dispatcher_name: string
    full_name: string
    id: number
    phone_number: string
    status: string
    summa_perechisleniya: number
    trailer_type: string
    truck_id: string
    wanted_date: string
    time: {
        to_factory_time: string
        loading_time: string
        getting_location_time: string
    }
    manager_comment: string
    ttn_document_url: string
    is_commented?: boolean
    by_card: number
    is_paid: {
        cash: boolean
        card: boolean
        summa_perechisleniya: boolean
    }
    prastoy_applications: {
        amount: number
        status: "waiting" | "approved" | "canceled"
    }[]
    dispatcher?: {
        id: number
        first_name: string
        last_name: string
    }
    is_rental: boolean
    exist_images: boolean
    agent_checked_status: "new" | "waiting" | "approved" | "None"
    departure_point_f: number
    dispatcher_status: string
    contact_id: number
}

type ReyestsOrder = {
    car_type: string
    code: string
    company_code: number
    departure_point: string
    destination: string
    distributor: string | null
    distributor_fk_id: number
    id: number
    note1: string | null
    note2: string | null
    order_type: "order" | "archive"
    status: string
    truck_id: string
    ttn: string | null
    wanted_date: string
}

type TDistributor = {
    id: number
    name: string
    distributor_codes: number[]
}

type OrderPlastic = {
    id: number
    code: string
    company_code: number
    wanted_date: string
    departure_point: string
    destination: string
    truck_id: string
    card: number
    phone_number: string
    by_card: number
    reyestr_comment: string
    summa_perechisleniya?: string
}



type OrderFactoryPay = {
    id: number
    code: string
    wanted_date: string
    departure_point: string
    destination: string
    agent_status: number
    truck_id: string
    trailer_id: string
    full_name: string
    cash: number
    phone_number: string
    company_code: number
    ttn_document_url: string | null
}


type TruckStatus = "10" | "20" | "30" | "40" | "50" | "60" | "" | "all"





type NewOrders = {
    id: number
    comment: string
    truck_type: string
    truck_count: string
    client: number
    date: string
    loading: number
    unloading: number
    payment_types: string[]
    start_time: string
    criteria: string[]
    product: string
    is_now: boolean
}

type Product = {
    id: number
    name: string
}

type TruckType = {
    id: number
    name: string
}

type UnloadingPoint = {
    id: number
    name: string
    products: Product[]
    truck_types: TruckType[]
}

type Palace = {
    id: number
    name: string
    unloading_points: UnloadingPoint[]
}

type OrderPlace = {
    palaces: Palace[]
    criteria: string[]
}

