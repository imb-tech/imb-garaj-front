import { FormDatePicker } from "@/components/form/date-picker"
import { FormFormatNumberInput } from "@/components/form/format-number-input"
import FormInput from "@/components/form/input"
import { FormNumberInput } from "@/components/form/number-input"
import { Button } from "@/components/ui/button"
import {
    SETTINGS_DRIVERS,
    SETTINGS_DRIVERS_CREATE,
    SETTINGS_DRIVERS_UPDATE,
} from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const AddDriverModal = () => {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()
    const currentDriver = getData<DriverFormType>(SETTINGS_DRIVERS)

    const form = useForm<DriverFormType>({
        defaultValues: currentDriver,
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            `Haydovchi muvaffaqiyatli ${currentDriver?.uuid ? "tahrirlandi!" : "qo'shildi"}`,
        )
        reset()
        clearKey(SETTINGS_DRIVERS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_DRIVERS] })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: DriverFormType) => {
        if (currentDriver?.uuid) {
            updateMutate(
                `${SETTINGS_DRIVERS_UPDATE}/${currentDriver.uuid}`,
                values,
            )
        } else {
            postMutate(SETTINGS_DRIVERS_CREATE, values)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-1">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid md:grid-cols-2 gap-4"
            >
                <FormInput
                    required
                    name="full_name"
                    label="F.I.O"
                    methods={form}
                    placeholder="Misol: Karimov Ali Aliyevich"
                />

                <FormFormatNumberInput
                    control={form.control}
                    format="+998 ## ### ## ##"
                    required
                    label={"Telefon"}
                    name={"phone"}
                    placeholder="+998 __ ___ __ __"
                />

                <FormInput
                    required
                    name="username"
                    label="Login"
                    methods={form}
                    placeholder="Misol: ali.karimov"
                />

                <FormInput
                    required={currentDriver?.uuid ? false : true}
                    type="password"
                    name="password"
                    label="Parol"
                    methods={form}
                    placeholder={
                        currentDriver?.uuid ?
                            "O'zgartirish uchun kiriting"
                        :   "Misol: SecurePass123!"
                    }
                />

                <FormInput
                    required
                    name="driver_profile.passport_number"
                    label="Pasport raqami"
                    methods={form}
                    placeholder="Misol: AA1234567"
                />

                <FormNumberInput
                    registerOptions={{
                        maxLength: {
                            value: 14,
                            message: "14 xonali bo'lishi kerak",
                        },
                        minLength: {
                            value: 14,
                            message: "14 xonali bo'lishi kerak",
                        },
                    }}
                    thousandSeparator={""}
                    required
                    name="driver_profile.pinfl"
                    label="PINFL"
                    control={form.control}
                    placeholder="Misol: 12345678901234"
                />

                <FormInput
                    required
                    name="driver_profile.driver_license"
                    label="Haydovchilik guvohnomasi"
                    methods={form}
                    placeholder="Misol: ABC1234567"
                />

                <FormNumberInput
                    required
                    name="driver_profile.work_experience"
                    label="Ish tajribasi (yil)"
                    control={form.control}
                    min={0}
                    placeholder="Misol: 5"
                />

                <FormDatePicker
                    required
                    name="driver_profile.license_expiry"
                    label="Guvohnoma amal qilish muddati"
                    control={form.control}
                    placeholder="15/12/2025"
                />

                <div className="flex items-center justify-end gap-2 md:col-span-2">
                    <Button
                        variant={"default2"}
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

export default AddDriverModal
