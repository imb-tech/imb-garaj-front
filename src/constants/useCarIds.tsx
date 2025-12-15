import { useGet } from "@/hooks/useGet"
import { CONTACTS_BY_TRUCK } from "./api-endpoints"

type IProps = {
    search?: string
}

export const useCarIds = ({ search }: IProps) => {
    const { data = [] } = useGet<OrderDispatchData["contact"][]>(CONTACTS_BY_TRUCK, {
        params: { search: search },
    })

    const cars = data.map((item) => ({
        ...item,
        label: item.truck_id,
        value: item.truck_id,
    }))

    return { cars }
}
