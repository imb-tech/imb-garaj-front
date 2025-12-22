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
import { TRIPS } from "@/constants/api-endpoints"



const AddShift = () => {
    const queryClient = useQueryClient()
    const { getData, clearKey } = useGlobalStore()
    const { closeModal } = useModal("create")

    const currentShift = getData<TripFormData & { id?: number }>(TRIPS)

    const form = useForm<TripFormData>({
        defaultValues: {
            driver: currentShift?.driver ?? "",
            vehicle: currentShift?.vehicle ?? "",
            start: currentShift?.start,
            type: currentShift?.type ?? "",
        },
    })

    const { handleSubmit, control, reset } = form

    const onSuccess = () => {
        toast.success(
            currentShift?.id
                ? "Reys tahrirlandi!"
                : "Reys qo'shildi!",
        )
        reset()
        clearKey(TRIPS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [TRIPS] })
    }

    const { mutate: create, isPending: creating } = usePost({ onSuccess })
    const { mutate: update, isPending: updating } = usePatch({ onSuccess })

    const isPending = creating || updating

    const onSubmit = (data: TripFormData) => {
        const formattedData = {
            ...data,
        }

        if (currentShift?.id) {
            update(`${TRIPS}/${currentShift.id}`, formattedData)
        } else {
            create(TRIPS, formattedData)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <FormCombobox
                required
                label="Haydovchi"
                name="driver"
                control={control}
                options={[
                    { label: "Boltavoy", value: "1" }, // adjust value to match backend (string or number)
                    { label: "Teshavoy", value: "2" },
                ]}
                   valueKey="value"
                labelKey="label"
                placeholder="Haydovchi tanlang"
            />

            <FormCombobox
                required
                label="Mashina"
                name="vehicle"
                control={control}
                options={[
                    { label: "Truck", value: "1" },
                    { label: "Van", value: "2" },
                    { label: "Box", value: "3" },
                ]}
                valueKey="value"
                labelKey="label"
                placeholder="Mashina tanlang"
            />

            <FormDatePicker
                required
                label="Reja qilingan yetkazib berish sanasi"
                control={control}
                name="start"
                placeholder="Sanani tanlang"
            />

            <FormCombobox
                required
                label="Reys turi"
                name="type"
                control={control}
                options={[
                    { label: "Oddiy", value: "1" },
                    { label: "Bo'sh", value: "2" },
                ]}
                   valueKey="value"
                labelKey="label"
                placeholder="Reys turini tanlang"
            />

            <div className="col-span-2 flex justify-end gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        reset()
                        clearKey(TRIPS)
                        closeModal()
                    }}
                    disabled={isPending}
                >
                    Bekor qilish
                </Button>

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

export default AddShift