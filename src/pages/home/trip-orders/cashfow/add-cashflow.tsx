import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { ORDER_CASHFLOWS, SETTINGS_SELECTABLE_EXPENSE_CATEGORY } from "@/constants/api-endpoints"
import { useSearch } from "@tanstack/react-router"
import { FormCombobox } from "@/components/form/combobox"
import { FormNumberInput } from "@/components/form/number-input"
import { useGet } from "@/hooks/useGet"

interface CashflowForm {
    action: number
    amount: number
    category: number
}

const AddCashflow = () => {
    const queryClient = useQueryClient()
    const { getData, clearKey } = useGlobalStore()
    const { closeModal } = useModal("create-order-cashflow")
    const search = useSearch({ strict: false })
    const orderId = Number(search.order)
    const { data: categoryData } = useGet<ExpenseCategory[]>(SETTINGS_SELECTABLE_EXPENSE_CATEGORY)
    const currentCashflow = getData<(CashflowForm & { id?: number })>(ORDER_CASHFLOWS)

    const form = useForm<CashflowForm>({
        defaultValues: {
            action: currentCashflow?.action,
            amount: currentCashflow?.amount,
            category: currentCashflow?.category
        }

    })

    const { handleSubmit, control, reset } = form

    const onSuccess = () => {
        toast.success(
            currentCashflow?.id
                ? "Cashflow tahrirlandi!"
                : "Cashflow qo‘shildi!"
        )
        reset()
        clearKey(ORDER_CASHFLOWS)
        closeModal()
        queryClient.invalidateQueries({
            queryKey: [ORDER_CASHFLOWS],
        })
    }

    const { mutate: create, isPending: creating } = usePost({ onSuccess })
    const { mutate: update, isPending: updating } = usePatch({ onSuccess })

    const onSubmit = (data: CashflowForm) => {
        if (!orderId) return

        const payload = {
            order: orderId,
            action: data.action,
            amount: Number(data.amount),
            category: data.category
        }

        if (currentCashflow?.id) {
            update(`${ORDER_CASHFLOWS}/${currentCashflow.id}`, payload)
        } else {
            create(ORDER_CASHFLOWS, payload)
        }
    }

    if (!orderId) {
        return (
            <div className="text-sm text-muted-foreground">
               Xarajatlar mavjud emas
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <FormCombobox
                required
                label="Amal turi"
                name="action"
                control={control}
                options={[
                    { id: 1, name: "Haydovchidan Menejerga" },
                    { id: 2, name: "Menejerdan Haydovchiga" },
                ]}
                valueKey="id"
                labelKey="name"
            />
            <FormCombobox
                required
                label="Xarajat turi"
                name="category"
                control={control}
                options={categoryData}
                valueKey="id"
                labelKey="name"
            />

            <FormNumberInput
                required
                name="amount"
                label="Miqdor"
                thousandSeparator=" "
                control={control}
                placeholder="0"
            />

            <div className="col-span-2 flex justify-end pt-4">
                <Button
                    type="submit"
                    loading={creating || updating}
                    disabled={creating || updating}
                >
                    Saqlash
                </Button>
            </div>
        </form>
    )
}

export default AddCashflow
