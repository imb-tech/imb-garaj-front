import { useGet } from "@/hooks/useGet"
import { SELECTABLE_FILTER, SELECTABLE_USERS } from "./api-endpoints"

type FilterType = {
    id: number
    name: string
}

export const useDistrictFilter = () => {
    const { data: district } = useGet<FilterType[]>(
        `${SELECTABLE_FILTER}district`,
    )

    return { district }
}

export const useDistributorsFilter = () => {
    const { data: distributor } = useGet<
        { id: number; name: string; distributor_codes: number[] }[]
    >(`${SELECTABLE_FILTER}distributor`)

    return { distributor }
}

export const useProductsFilter = () => {
    const { data: products } = useGet<FilterType[]>(
        `${SELECTABLE_FILTER}product`,
    )

    return { products }
}

export const useTruckTypeFilter = () => {
    const { data: truck_type } = useGet<FilterType[]>(
        `${SELECTABLE_FILTER}option`,
        {
            params: { type: "truck_type" },
        },
    )

    return { truck_type }
}

export const useRegionsFilter = () => {
    const { data: regions } = useGet<FilterType[]>(`${SELECTABLE_FILTER}region`)

    return { regions }
}

export const useCriteriaFilter = () => {
    const { data: criteria } = useGet<FilterType[]>(
        `${SELECTABLE_FILTER}criteria`,
    )

    return { criteria }
}

export const useUsersFilter = ({ role }: { role: string }) => {
    const { data } = useGet<
        {
            id: number
            full_name: string
        }[]
    >(SELECTABLE_USERS)

    const users =
        data?.map((f) => ({
            id: f.id,
            label: f.full_name,
            value: f.id,
        })) || []

    return { users }
}

export const useTrailerTypeFilter = () => {
    const { data: trailer_type } = useGet<FilterType[]>(
        `${SELECTABLE_FILTER}option`,
        {
            params: { type: "trailer_type" },
        },
    )

    return { trailer_type }
}

export const useTruckModelFilter = () => {
    const { data: truck_model } = useGet<FilterType[]>(
        `${SELECTABLE_FILTER}option`,
        {
            params: { type: "truck_model" },
        },
    )

    return { truck_model }
}
