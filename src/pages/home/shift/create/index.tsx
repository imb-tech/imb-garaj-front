import { FormCombobox } from "@/components/form/combobox"
import { FormDatePicker } from "@/components/form/date-picker"
import { Button } from "@/components/ui/button"
import { SHIFTS } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

interface ShiftFormData {
    driver: number | string // adjust to number if IDs are numbers
    vehicle: number | string
    scheduled_delivery_date: Date
    shift_type: number | string
}

const AddShift = () => {
    const queryClient = useQueryClient()
    const { getData, clearKey } = useGlobalStore()
    const { closeModal } = useModal("create")

    const currentShift = getData<ShiftFormData & { id?: number }>(SHIFTS)

    const form = useForm<ShiftFormData>({
        defaultValues: {
            driver: currentShift?.driver ?? "",
            vehicle: currentShift?.vehicle ?? "",
            scheduled_delivery_date: currentShift?.scheduled_delivery_date
                ? new Date(currentShift.scheduled_delivery_date)
                : new Date(),
            shift_type: currentShift?.shift_type ?? "",
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
        clearKey(SHIFTS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [SHIFTS] })
    }

    const { mutate: create, isPending: creating } = usePost({ onSuccess })
    const { mutate: update, isPending: updating } = usePatch({ onSuccess })

    const isPending = creating || updating

    const onSubmit = (data: ShiftFormData) => {
        const formattedData = {
            ...data,
            scheduled_delivery_date: data.scheduled_delivery_date.toISOString().split('T')[0], // or full ISO if backend expects
        }

        if (currentShift?.id) {
            update(`${SHIFTS}/${currentShift.id}`, formattedData)
        } else {
            create(SHIFTS, formattedData)
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
                placeholder="Mashina tanlang"
            />

            <FormDatePicker
                required
                label="Reja qilingan yetkazib berish sanasi"
                control={control}
                name="scheduled_delivery_date"
                placeholder="Sanani tanlang"
            />

            <FormCombobox
                required
                label="Reys turi"
                name="shift_type"
                control={control}
                options={[
                    { label: "Oddiy", value: "1" },
                    { label: "Bo'sh", value: "2" },
                ]}
                placeholder="Reys turini tanlang"
            />

            <div className="col-span-2 flex justify-end gap-4 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        reset()
                        clearKey(SHIFTS)
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