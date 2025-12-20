import { FormCombobox } from "@/components/form/combobox"
import FormInput from "@/components/form/input"
import { FormNumberInput } from "@/components/form/number-input"
import { Button } from "@/components/ui/button"
import { SETTINGS_PRODUCTS } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const AddProductModal = () => {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()

    const currentProduct = getData<ProductsType>(SETTINGS_PRODUCTS)
    const form = useForm<ProductsType>({
        defaultValues: currentProduct,
    })

    const CURRENCY_OPTIONS = [
        { label: "🇺🇸 US Dollar (USD)", value: 1 },
        { label: "🇪🇺  Euro (EUR)", value: 2 },
        { label: "🇺🇿  Uzbekistani Som (UZS)", value: 3 },
        { label: "🇷🇺 Russian Ruble (RUB)", value: 4 },
        { label: "🇰🇿 Kazakhstani Tenge (KZT)", value: 5 },
        { label: "🇯🇵 Japanese Yen (JPY)", value: 6 },
    ]

    const UNIT_OPTIONS = [
        { value: 0, label: "Pieces" },
        { value: 1, label: "Kg" },
        { value: 2, label: "Pound" },
        { value: 3, label: "Square meter" },
        { value: 4, label: "Liter" },
        { value: 5, label: "Cubic meter" },
        { value: 6, label: "Gallon" },
    ]

    const { handleSubmit, reset, setError } = form

    const onSuccess = () => {
        toast.success(
            `Mahsulot muvaffaqiyatli ${currentProduct?.uuid ? "tahrirlandi!" : "qo'shildi"} `,
        )
        reset()

        closeModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_PRODUCTS] })
        clearKey("create")
    }

    const onError = (error: any) => {
        if (error.response?.data) {
            const errorData = error.response.data

            Object.keys(errorData).forEach((fieldName) => {
                const errorMessages = errorData[fieldName]
                if (errorMessages && errorMessages.length > 0) {
                    setError(fieldName as keyof ProductsType, {
                        type: "server",
                        message: errorMessages[0],
                    })
                }
            })
        } else {
            toast.error("Xatolik yuz berdi")
        }
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
        onError,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
        onError,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: ProductsType) => {
        if (currentProduct?.uuid) {
            updateMutate(`${SETTINGS_PRODUCTS}/${currentProduct.uuid}`, values)
        } else {
            postMutate(SETTINGS_PRODUCTS, values)
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
                        label="Nomi"
                        methods={form}
                        placeholder="Misol: Bolt M12, 50mm"
                    />

                    <FormInput
                        required
                        name="description"
                        label="Eslatma"
                        methods={form}
                        placeholder="Misol: Po'lat bolt, M12, uzunligi 50mm"
                    />

                    <FormCombobox
                        name="unit"
                        label="O'lchov turlari"
                        control={form.control}
                        options={UNIT_OPTIONS}
                        labelKey="label"
                        valueKey="value"
                        placeholder="Birlikni tanlang"
                    />

                    <FormCombobox
                        name="currency"
                        label="Valyuta"
                        control={form.control}
                        options={CURRENCY_OPTIONS}
                        className="w-full"
                        valueKey="value"
                        labelKey="label"
                        placeholder="Valyutani tanlang"
                    />

                    <FormNumberInput
                        required
                        name="price"
                        label="Narxi"
                        control={form.control}
                        placeholder="Misol: 15000"
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

export default AddProductModal
