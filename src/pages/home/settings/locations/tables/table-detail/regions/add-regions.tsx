import { FormCombobox } from "@/components/form/combobox"
import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { SETTINGS_COUNTRIES, SETTINGS_REGIONS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { toast } from "sonner"

const AddRegionsModal = () => {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()
    const { data: countries } =
        useGet<ListResponse<RolesType>>(SETTINGS_COUNTRIES)

    const currentRegion = getData<RegionsType>(SETTINGS_REGIONS)
    const form = useForm<RegionsType>({
        defaultValues: currentRegion,
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            `Viloyat muvaffaqiyatli ${currentRegion?.id ? "tahrirlandi!" : "qo'shildi"} `,
        )

        reset()
        clearKey(SETTINGS_REGIONS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_REGIONS] })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: RegionsType) => {
        if (currentRegion?.id) {
            updateMutate(`${SETTINGS_REGIONS}/${currentRegion.id}`, values)
        } else {
            postMutate(SETTINGS_REGIONS, values)
        }
    }
    console.log(currentRegion?.id);
    
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
                        label="Viloyat nomi"
                        methods={form}
                    />

                    <FormCombobox
                        label="Davlat"
                        name="country"
                        options={countries?.results}
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

export default AddRegionsModal
