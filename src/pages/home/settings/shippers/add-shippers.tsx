import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { SETTINGS_SHIPPERS } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const AddShippersModal = () => {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()
    const currentShipper = getData<ShippersType>(SETTINGS_SHIPPERS)

    const form = useForm<ShippersType>({
        defaultValues: currentShipper,
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            `Haydovchi muvaffaqiyatli ${currentShipper?.id ? "tahrirlandi!" : "qo'shildi"}`,
        )
        reset()
        clearKey(SETTINGS_SHIPPERS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_SHIPPERS] })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: ShippersType) => {
        if (currentShipper?.id) {
            updateMutate(`${SETTINGS_SHIPPERS}/${currentShipper.id}`, values)
        } else {
            postMutate(SETTINGS_SHIPPERS, values)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput required name="name" label="F.I.O" methods={form} />

            <div className="flex items-center justify-end  mt-3">
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
    )
}

export default AddShippersModal
