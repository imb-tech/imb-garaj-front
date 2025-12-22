import { FormCombobox } from "@/components/form/combobox"
import { FormDatePicker } from "@/components/form/date-picker"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { TRIPS, TRIPS_ORDERS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"




const AddTripOrders = () => {
    const queryClient = useQueryClient()
    const { getData, clearKey } = useGlobalStore()
    const { closeModal } = useModal("create")
    const currentTripOrder = getData<TripsOrders & { id?: number }>(TRIPS_ORDERS)
    const { data: districtsData } = useGet<DistrictType>(TRIPS_ORDERS, {
        params: {
            model_name: "district"
        }
    })


    const form = useForm<TripsOrders>({
        defaultValues: {
            loading: currentTripOrder?.loading,
            unloading: currentTripOrder?.unloading,
            trip: currentTripOrder?.trip
        },
    })

    const { handleSubmit, control, reset } = form

    const onSuccess = () => {
        toast.success(
            currentTripOrder?.id
                ? "Buyurtma tahrirlandi!"
                : "Buyurtma qo'shildi!",
        )
        reset()
        clearKey(TRIPS_ORDERS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [TRIPS_ORDERS] })
    }

    const { mutate: create, isPending: creating } = usePost({ onSuccess })
    const { mutate: update, isPending: updating } = usePatch({ onSuccess })

    const isPending = creating || updating

    const onSubmit = (data: TripsOrders) => {
        const formattedData = {
            ...data,
        }

        if (currentTripOrder?.id) {
            update(`${TRIPS_ORDERS}/${currentTripOrder.id}`, formattedData)
        } else {
            create(TRIPS_ORDERS, formattedData)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <FormCombobox
                required
                label="Yuklash manzili"
                name="loading"
                control={control}
                options={districtsData}
                valueKey="value"
                labelKey="label"
                placeholder="Hududni tanlang"
            />
            <FormCombobox
                required
                label="Yuk tushirish manzili"
                name="unloading"
                control={control}
                options={districtsData}
                valueKey="value"
                labelKey="label"
                placeholder="Hududni tanlang"
            />
            <FormCombobox
                required
                label="Yuk tushirish manzili"
                name="unloading"
                control={control}
                options={districtsData}
                valueKey="value"
                labelKey="label"
                placeholder="Hududni tanlang"
            />

            <div className="col-span-2 flex justify-end gap-4 pt-4">


                <Button
                    type="submit"
                    loading={isPending}
                    disabled={isPending}
                >
                    Saqlash
                </Button>
            </div>
        </form>
    )
}

export default AddTripOrders