import { FormCombobox } from "@/components/form/combobox"
import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { SETTINGS_DISTRICTS, SETTINGS_REGIONS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { toast } from "sonner"

const AddDestrictsModal = () => {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()
    const { data: regions } = useGet<ListResponse<RolesType>>(SETTINGS_REGIONS)

    const currentDistrict = getData<SettingsDistrictType>(SETTINGS_DISTRICTS)
    const form = useForm<SettingsDistrictType>({
        defaultValues: currentDistrict,
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            `Tuman muvaffaqiyatli ${currentDistrict?.id ? "tahrirlandi!" : "qo'shildi"} `,
        )

        reset()
        clearKey(SETTINGS_DISTRICTS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_DISTRICTS] })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: SettingsDistrictType) => {
        if (currentDistrict?.id) {
            updateMutate(`${SETTINGS_DISTRICTS}/${currentDistrict.id}`, values)
        } else {
            postMutate(SETTINGS_DISTRICTS, values)
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
                        name="name"
                        label="Tuman nomi"
                        methods={form}
                    />

                    <FormCombobox
                        label="Viloyat"
                        name="region"
                        options={regions?.results}
                        control={form.control}
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
        </>
    )
}

export default AddDestrictsModal
