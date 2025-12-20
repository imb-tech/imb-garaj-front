import FormInput from "@/components/form/input"
import { FormNumberInput } from "@/components/form/number-input"
import { Button } from "@/components/ui/button"
import { SETTINGS_FORWARDERS } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { toast } from "sonner"

const AddForwarderModal = () => {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()

    const currentForwarder = getData<ForwardersType>(SETTINGS_FORWARDERS)
    const form = useForm<ForwardersType>({
        defaultValues: currentForwarder,
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            `Avtomobil muvaffaqiyatli ${currentForwarder?.id ? "tahrirlandi!" : "qo'shildi"} `,
        )

        reset()
        clearKey(SETTINGS_FORWARDERS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_FORWARDERS] })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: ForwardersType) => {
        if (currentForwarder?.id) {
            updateMutate(
                `${SETTINGS_FORWARDERS}/${currentForwarder.id}`,
                values,
            )
        } else {
            postMutate(SETTINGS_FORWARDERS, values)
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
                    />
                    <FormInput
                        required
                        name="phone_number"
                        label="Telefon raqami"
                        methods={form}
                    />
                    <FormInput
                        required
                        name="passport_series"
                        label="Pasport seriya va raqami"
                        methods={form}
                    />
                    <FormNumberInput
                        registerOptions={{
                            max: {
                                value: 14,
                                message: "14 xonali bo'lishi kerak",
                            },
                        }}
                        thousandSeparator={""}
                        required
                        name="jshshir"
                        label="JShShIR"
                        control={form.control}
                    />
                    <FormInput
                        required
                        name="warehouse"
                        label="Ombor"
                        methods={form}
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

export default AddForwarderModal
