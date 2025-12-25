import { FormCheckbox } from "@/components/form/checkbox"
import { FormDatePicker } from "@/components/form/date-picker"
import { FormFormatNumberInput } from "@/components/form/format-number-input"
import FormInput from "@/components/form/input"
import { FormNumberInput } from "@/components/form/number-input"
import { Button } from "@/components/ui/button"
import { SETTINGS_DRIVERS } from "@/constants/api-endpoints"
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
    const currentDriver = getData<DriversType>(SETTINGS_DRIVERS)

    const form = useForm<DriversType>({
        defaultValues: currentDriver,
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            `Haydovchi muvaffaqiyatli ${currentDriver?.id ? "tahrirlandi!" : "qo'shildi"}`,
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

    const onSubmit = (values: DriversType) => {
        if (currentDriver?.id) {
            updateMutate(`${SETTINGS_DRIVERS}/${currentDriver.id}`, values)
        } else {
            postMutate(SETTINGS_DRIVERS, values)
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
                    name="first_name"
                    label="Ism"
                    methods={form}
                    placeholder="Misol: Ali "
                />
                <FormInput
                    required
                    name="last_name"
                    label="Familiya"
                    methods={form}
                    placeholder="Misol: Karimov"
                />
                <FormInput
                    required
                    name="username"
                    label="Login"
                    methods={form}
                    placeholder="Misol: ali.karimov"
                />

                <FormInput
                    required={currentDriver?.id ? false : true}
                    type="password"
                    name="password"
                    label="Parol"
                    methods={form}
                    placeholder={
                        currentDriver?.id ?
                            "O'zgartirish uchun kiriting"
                        :   "Misol: SecurePass123!"
                    }
                />

                <FormFormatNumberInput
                    control={form.control}
                    format="+998 ## ### ## ##"
                    required
                    label={"Telefon"}
                    name={"driver.phone"}
                    placeholder="+998 __ ___ __ __"
                />

                <FormInput
                    required
                    name="driver.passport_serial"
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
                    name="driver.pinfl"
                    label="PINFL"
                    control={form.control}
                    placeholder="Misol: 12345678901234"
                />

                <FormInput
                    required
                    name="driver.driver_license"
                    label="Haydovchilik guvohnomasi"
                    methods={form}
                    placeholder="Misol: ABC1234567"
                />

                <FormNumberInput
                    required
                    name="driver.experience"
                    label="Ish tajribasi (yil)"
                    control={form.control}
                    min={0}
                    placeholder="Misol: 5"
                />

                <FormDatePicker
                    required
                    name="driver.driver_license_date"
                    label="Guvohnoma amal qilish muddati"
                    control={form.control}
                    placeholder="15/12/2025"
                />

                <div className="md:col-span-2 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <FormCheckbox
                            name="is_staff"
                            label="Xodim"
                            control={form.control}
                        />
                        <FormCheckbox
                            name="is_active"
                            label="Aktiv"
                            control={form.control}
                        />
                        <FormCheckbox
                            name="is_superuser"
                            label="Super foydalanuvchi"
                            control={form.control}
                        />
                    </div>
                </div>

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

export default AddDriverModal
