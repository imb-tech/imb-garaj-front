import { FormCombobox } from "@/components/form/combobox"
import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { SETTINGS_CARS } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const FUEL_TYPE_OPTIONS = [
    { label: "Dizel", value: 2 },
    { label: "Propan", value: 6 },
    { label: "Benzin", value: 1 },
    { label: "Metan", value: 3 },
    { label: "Elektr", value: 4 },
    { label: "Gibrid", value: 5 },
]

const VEHICLE_TYPE_OPTIONS = [
    { label: "Yengil avtomobil", value: 1 },
    { label: "Yuk avtomobili", value: 2 },
    { label: "Avtobus", value: 3 },
    { label: "Treyler", value: 4 },
    { label: "Maxsus texnika", value: 7 },
    { label: "Refrijerator", value: 10 },
]

const AddCarsModal = () => {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()
    const currentCar = getData<CarsType>(SETTINGS_CARS)

    const form = useForm<CarsType>({
        defaultValues: { ...currentCar, type: currentCar?.type || 1 },
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            currentCar?.uuid ?
                "Avtomobil tahrirlandi!"
            :   "Avtomobil qo'shildi!",
        )
        reset()
        clearKey(SETTINGS_CARS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_CARS] })
    }

    const { mutate: create, isPending: creating } = usePost({ onSuccess })
    const { mutate: update, isPending: updating } = usePatch({ onSuccess })
    const isPending = creating || updating

    const onSubmit = (data: CarsType) => {
        if (currentCar?.uuid) {
            update(`${SETTINGS_CARS}/${currentCar.uuid}`, data)
        } else {
            create(SETTINGS_CARS, data)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid md:grid-cols-2 gap-5"
            >
                <FormInput
                    required
                    name="number"
                    label="Avtomobil raqami"
                    methods={form}
                    maxLength={20}
                    placeholder="Misol: 01 A 123 AA"
                />

                <FormInput
                    required
                    name="license"
                    label="Guvohnoma raqami"
                    methods={form}
                    maxLength={50}
                    placeholder="Misol: ABC1234567"
                />

                <FormInput
                    required
                    name="serial_number"
                    label="Seriya raqami"
                    methods={form}
                    maxLength={100}
                    placeholder="Misol: VIN12345678901234"
                />

                <FormInput
                    required
                    name="year"
                    label="Ishlab chiqarilgan yili"
                    methods={form}
                    placeholder="Misol: 2023"
                />

                <FormCombobox
                    required
                    label="Avtomobil turi"
                    name="type"
                    control={form.control}
                    options={VEHICLE_TYPE_OPTIONS}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Misol: Yengil avtomobil"
                />

                <FormCombobox
                    required
                    label="Yoqilg'i turi"
                    name="fuel_type"
                    control={form.control}
                    options={FUEL_TYPE_OPTIONS}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Misol: Benzin"
                />

                <FormInput
                    required
                    name="size"
                    label="Yuk sig'imi (kg)"
                    type="number"
                    methods={form}
                    placeholder="Misol: 1000"
                />

                <FormInput
                    name="depot"
                    label="Ombor ID (ixtiyoriy)"
                    type="number"
                    methods={form}
                    placeholder="Misol: 15"
                />

                <FormInput
                    required
                    name="driver"
                    label="Haydovchi ID"
                    type="number"
                    methods={form}
                    placeholder="Misol: 42"
                />

                <div className="md:col-span-2 flex justify-end ">
                    <Button
                        loading={isPending}
                        type="submit"
                        className="min-w-40"
                        variant={"default2"}
                    >
                        Saqlash
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default AddCarsModal
