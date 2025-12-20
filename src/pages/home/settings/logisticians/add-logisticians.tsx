import { FormFormatNumberInput } from "@/components/form/format-number-input"
import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import {
    SETTINGS_LOGISTICIANS,
    SETTINGS_LOGISTICIANS_UPDATE,
    SETTINGS_WAREHOUSE,
} from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { FormCombobox } from "@/components/form/combobox"
import { useGet } from "@/hooks/useGet"
import { toast } from "sonner"

const AddLogisticansModal = () => {
    const { data } = useGet(SETTINGS_WAREHOUSE)
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()

    const currentLogistician = getData<LogisticiansType>(SETTINGS_LOGISTICIANS)
    const form = useForm<LogisticiansType>({
        defaultValues: currentLogistician,
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            `Logist muvaffaqiyatli ${currentLogistician?.uuid ? "tahrirlandi!" : "qo'shildi"} `,
        )
        reset()
        clearKey(SETTINGS_LOGISTICIANS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_LOGISTICIANS] })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: LogisticiansType) => {
        if (currentLogistician?.uuid) {
            updateMutate(
                `${SETTINGS_LOGISTICIANS_UPDATE}/${currentLogistician?.uuid}`,
                values,
            )
        } else {
            postMutate(SETTINGS_LOGISTICIANS, values)
        }
    }

    return (
        <>
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
                        placeholder="Misol: Ismoilov Islom Islomovich"
                    />

                    <FormInput
                        required
                        name="username"
                        label="Login"
                        methods={form}
                        placeholder="Misol: islom.ismoilov"
                    />

                    <FormInput
                        required={currentLogistician?.uuid ? false : true}
                        name="password"
                        label="Parol"
                        methods={form}
                        placeholder="Misol: StrongPass123!"
                    />

                    <FormFormatNumberInput
                        control={form.control}
                        format="+998 ## ### ## ##"
                        required
                        label={"Telefon"}
                        name={"phone"}
                        placeholder="+998 __ ___ __ __"
                    />

                    <FormCombobox
                        name="depot"
                        label="Ombor"
                        options={data?.results}
                        control={form.control}
                        valueKey="id"
                        labelKey="name"
                        placeholder="Ombor tanlang"
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
        </>
    )
}

export default AddLogisticansModal
