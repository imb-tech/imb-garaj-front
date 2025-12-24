import { FormCombobox } from "@/components/form/combobox"
import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { SETTINGS_EXPENSES, VEHICLES_CASHFLOWS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const AddVehicleCashflowModal = () => {
    const params = useParams({ strict: false })
    const id = params.id
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()
    const currentVehicleCashflow =
        getData<VehicleCashFlowAdd>(VEHICLES_CASHFLOWS)

    const form = useForm<VehicleCashFlowAdd>({
        defaultValues: currentVehicleCashflow,
    })

    const { handleSubmit, reset } = form

    const onSuccess = () => {
        toast.success(
            `Xarajat muvaffaqiyatli ${currentVehicleCashflow?.id ? "tahrirlandi!" : "qo'shildi"}`,
        )
        reset()
        clearKey(VEHICLES_CASHFLOWS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [VEHICLES_CASHFLOWS] })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: VehicleCashFlowAdd) => {
        if (currentVehicleCashflow?.id) {
            updateMutate(
                `${VEHICLES_CASHFLOWS}/${currentVehicleCashflow.id}`,
                values,
            )
        } else {
            postMutate(VEHICLES_CASHFLOWS, values)
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
                    name="vehicle"
                    label="Avtomobil"
                    methods={form}
                />
                <FormInput
                    required
                    name="amount"
                    label="Miqdor"
                    methods={form}
                />
                <FormCombobox
                    required
                    options={[]}
                    name="category"
                    label="Xarajat turi"
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
    )
}

export default AddVehicleCashflowModal
