import { FormCombobox } from "@/components/form/combobox"
import { FormDatePicker } from "@/components/form/date-picker"
import { Button } from "@/components/ui/button"
import {
    MANAGERS_TRIPS,
    MANAGERS_VEHICLES,
    SETTINGS_DRIVERS,
    VEHICLES,
} from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export default function CreateManagerTrips() {
    const queryClient = useQueryClient()
    const { getData } = useGlobalStore()
    const item = getData(MANAGERS_VEHICLES)

    const form = useForm<ManagerTrips>({
        defaultValues: {
            ...item,
        },
    })
    const { handleSubmit, reset, control } = form
    const { data: drivers } = useGet(SETTINGS_DRIVERS, {
        params: {
            page_size: 10000,
        },
    })

    const { data: vehicles } = useGet(VEHICLES, {
        params: {
            page_size: 10000,
        },
    })
    function onSuccess() {
        queryClient.invalidateQueries({ queryKey: [MANAGERS_VEHICLES] })
        toast.success(
            item?.id ?
                "Muvaffaqiyatli tahrirlandi!"
            :   "Muvaffaqiyatli qo'shildi!",
        )
        reset()
    }
    const { mutate: createTrip } = usePost({
        onSuccess,
    })
    const { mutate: editTrip } = usePatch({
        onSuccess,
    })

    function onSubmit(item: ManagerTrips) {
        if(item?.id){
            editTrip(`${MANAGERS_TRIPS}/${item?.id}`,item)
        }else{
            createTrip(MANAGERS_TRIPS,item)
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <FormDatePicker
                    name="start"
                    required
                    fullWidth
                    label="Chiqib ketgan"
                    control={control}
                />
                <FormDatePicker
                    name="end"
                    required
                    fullWidth
                    label="Tugallangan"
                    control={control}
                />
                <FormCombobox
                    control={control}
                    required
                    name="driver"
                    options={drivers?.results}
                    labelKey="first_name"
                    valueKey="id"
                    label="Haydovchi"
                />
                <FormCombobox
                    labelKey=""
                    valueKey="id"
                    required
                    control={control}
                    name="vehicle"
                    options={vehicles?.results}
                    label="Tirkama raqami"
                />

                <div className="flex justify-end">
                    <Button>Saqlash</Button>
                </div>
            </form>
        </>
    )
}
