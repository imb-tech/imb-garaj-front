import { FormCombobox } from "@/components/form/combobox"
import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import {
    SETTINGS_DRIVERS,
    SETTINGS_VEHICLE_TYPE,
} from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const vehicleTypeOptions = [
    { id: 1, name: "Yuk tashuvchi" },
    { id: 2, name: "Qazuvchi" },
]

const AddVehicleModal = () => {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()
    const currentVehicle = getData<any>(SETTINGS_VEHICLE_TYPE)

    const { data: driversData } = useGet(SETTINGS_DRIVERS, {
        params: { page_size: 10000 },
    })
    const drivers = useMemo(
        () =>
            driversData?.results?.map((d: any) => ({
                ...d,
                full_name: `${d.first_name} ${d.last_name || ""}`.trim(),
            })) ?? [],
        [driversData],
    )

    const form = useForm<any>({
        defaultValues: currentVehicle,
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            `Avtomobil muvaffaqiyatli ${currentVehicle?.id ? "tahrirlandi!" : "qo'shildi"}`,
        )
        reset()
        clearKey(SETTINGS_VEHICLE_TYPE)
        closeModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_VEHICLE_TYPE] })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: any) => {
        if (currentVehicle?.id) {
            updateMutate(`${SETTINGS_VEHICLE_TYPE}/${currentVehicle.id}`, values)
        } else {
            postMutate(SETTINGS_VEHICLE_TYPE, values)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-1">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <FormInput
                    required
                    name="truck_number"
                    label="Avtomobil raqami"
                    methods={form}
                    placeholder="Misol: 01A123BC"
                    uppercase={true}
                />
                <FormCombobox
                    required
                    name="type"
                    label="Avtomobil turi"
                    options={vehicleTypeOptions}
                    control={form.control}
                    labelKey="name"
                    valueKey="id"
                />
                <FormCombobox
                    name="driver"
                    label="Haydovchi"
                    options={drivers}
                    control={form.control}
                    labelKey="full_name"
                    valueKey="id"
                />

                <div className="flex items-center justify-end gap-2 md:col-span-2">
                    <Button
                        className="min-w-36 w-full md:w-max"
                        type="submit"
                        loading={isPending}
                    >
                        {"Saqlash"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AddVehicleModal
