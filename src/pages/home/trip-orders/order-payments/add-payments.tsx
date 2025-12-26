import { FormCombobox } from "@/components/form/combobox"
import FormInput from "@/components/form/input"
import { FormNumberInput } from "@/components/form/number-input"
import { Button } from "@/components/ui/button"
import {
    SETTINGS_SELECTABLE_EXPENSE_CATEGORY,
    TRIPS_ORDERS_PAYMENT,
} from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useSearch } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface CashflowForm {
    action: number
    amount: number
    category: number
    comment: string
    currency: number | string
    currency_course: number | string
}

const AddPayment = () => {
    const queryClient = useQueryClient()
    const { getData, clearKey } = useGlobalStore()
    const { closeModal } = useModal("create-order-payment")
    const search = useSearch({ strict: false })
    const orderId = Number(search.order)
    const { data: categoryData } = useGet<ExpenseCategory[]>(
        SETTINGS_SELECTABLE_EXPENSE_CATEGORY,
    )
    const currentCashflow = getData<CashflowForm & { id?: number }>(
        TRIPS_ORDERS_PAYMENT,
    )

    const form = useForm<CashflowForm>({
        defaultValues: {
            action: currentCashflow?.action,
            amount: currentCashflow?.amount,
            category: currentCashflow?.category,
            comment: currentCashflow?.comment,
            currency: currentCashflow?.currency,
            currency_course: currentCashflow?.currency_course
        },
    })

    const { handleSubmit, control, reset, watch } = form
    const selectedCurrency = watch("currency")

    const onSuccess = () => {
        toast.success(
            currentCashflow?.id ? "To'lov tahrirlandi!" : "To'lov qo‘shildi!",
        )
        reset()
        clearKey(TRIPS_ORDERS_PAYMENT)
        closeModal()
        queryClient.invalidateQueries({
            queryKey: [TRIPS_ORDERS_PAYMENT],
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
            category: data.category,
            comment: data.comment,
            currency: data.currency,
            currency_course: data.currency_course
        }

        if (currentCashflow?.id) {
            update(`${TRIPS_ORDERS_PAYMENT}/${currentCashflow.id}`, payload)
        } else {
            create(TRIPS_ORDERS_PAYMENT, payload)
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
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
        >
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
            <FormCombobox
                required
                label="Valyuta"
                name="currency"
                control={control}
                options={[
                    { value: 1, label: "UZS - So‘m" },
                    { value: 2, label: "USD - AQSh dollari" },
                ]}
                valueKey="value"
                labelKey="label"
                placeholder="Valyutani tanlang"

            />
            {selectedCurrency === 2 && (
                <FormNumberInput
                    thousandSeparator=" "
                    name="currency_course"
                    label="Valyuta kursi"
                    placeholder="12 206 UZS"
                    control={control}
                />
            )}

            <div>
                <FormNumberInput
                    required
                    name="amount"
                    label="Miqdor"
                    thousandSeparator=" "
                    control={control}
                    placeholder="0 UZS"
                />
                <FormInput
                    required
                    name="comment"
                    label="To'ov uchun izoh"
                    methods={form}
                    placeholder="Misol: Yoqilg'i uchun"
                />
            </div>

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

export default AddPayment
