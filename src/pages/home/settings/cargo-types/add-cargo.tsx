import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { SETTINGS_ROLES } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const AddCargoModal = () => {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()
    const currentRole = getData<RolesType>(SETTINGS_ROLES)

    const form = useForm<RolesType>({
        defaultValues: currentRole,
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            `Yuk turi muvaffaqiyatli ${currentRole?.id ? "tahrirlandi!" : "qo'shildi"}`,
        )
        reset()
        clearKey(SETTINGS_ROLES)
        closeModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_ROLES] })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: RolesType) => {
        if (currentRole?.id) {
            updateMutate(`${SETTINGS_ROLES}/${currentRole.id}`, values)
        } else {
            postMutate(SETTINGS_ROLES, values)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormInput required name="name" label="Yuk turi" methods={form} />

            <div className="flex items-center justify-end  mt-3">
                <Button
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

export default AddCargoModal
