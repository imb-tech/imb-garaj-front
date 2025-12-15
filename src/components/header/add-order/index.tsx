import SelectField from "@/components/fields/select-field"
import { FormCheckbox } from "@/components/form/checkbox"
import { FormDatePicker } from "@/components/form/date-picker"
import { FormInput } from "@/components/form/input"
import { FormMultiCombobox } from "@/components/form/multi-combobox"
import { FormNumberInput } from "@/components/form/number-input"
import FormTextarea from "@/components/form/textarea"
import { Button } from "@/components/ui/button"
import {
    CLIENTS_AVAILABLE,
    MANAGERS_ORDERS_CREATE,
    MANAGERS_ORDERS_NEW,
} from "@/constants/api-endpoints"
import { useCodes } from "@/constants/useCodes"
import { useCriteriaFilter } from "@/constants/useSelectableFilter"
import { DEFAULT_ORDER_VALUE } from "@/constants/zustand-store-keys"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Clock, RotateCcw } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const options = [
    {
        id: "cash",
        name: "Naqt pul orqali",
    },
    {
        id: "transfer",
        name: "Pul o'tkazma",
    },
    {
        id: "card",
        name: "Karta orqali",
    },
]

export const AddOrder = () => {
    const queryClient = useQueryClient()
    const { criteria } = useCriteriaFilter()
    const { closeModal } = useModal("order-create")

    const { setData, clearKey, getData } = useGlobalStore()
    const store = getData<NewOrders>(DEFAULT_ORDER_VALUE)
    const currentRow = getData<OrderDispatchData>(MANAGERS_ORDERS_NEW)

    const onSuccess = () => {
        closeModal()
        form.reset()
        toast.success(
            `Muvaffaqiyatli ${store?.id ? "tasdiqlandi" : "qo'shildi"}`,
        )
        if (currentRow?.id) {
            queryClient.refetchQueries({ queryKey: [MANAGERS_ORDERS_NEW] })
        }
    }

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const form = useForm<NewOrders>({
        defaultValues: {
            date: format(new Date(), "yyyy-MM-dd"),
            start_time: format(new Date(), "HH:mm"),
            is_now: true,
        },
    })

    const { codes, isLoading } = useCodes()
    const client = form.watch("client")
    const loading = form.watch("loading")
    const unloading = form.watch("unloading")

    const { data } = useGet<OrderPlace>(`${CLIENTS_AVAILABLE}/${client}`, {
        enabled: !!client,
    })

    // Yuklash joylari ro'yxati
    const loadingData = useMemo(() => {
        return (
            data?.palaces?.map((item) => ({
                id: item.id,
                name: item.name,
            })) || []
        )
    }, [data])

    // Tanlangan loading joy
    const selectedLoading = useMemo(() => {
        return data?.palaces?.find((pl) => pl.id === loading)
    }, [data, loading])

    // Unloading joylar
    const unloadingData = useMemo(() => {
        return (
            selectedLoading?.unloading_points?.map((point) => ({
                id: point.id,
                name: point.name,
            })) || []
        )
    }, [selectedLoading])

    // Tanlangan unloading joy
    const selectedUnloading = useMemo(() => {
        return selectedLoading?.unloading_points?.find(
            (point) => point.id === unloading,
        )
    }, [selectedLoading, unloading])

    // Mahsulotlar
    const products = useMemo(() => {
        return (
            selectedUnloading?.products?.map((prod) => ({
                id: prod.id,
                name: prod.name,
            })) || []
        )
    }, [selectedUnloading])

    // Transportlar
    const transports = useMemo(() => {
        return (
            selectedUnloading?.truck_types?.map((truck) => ({
                id: truck.id,
                name: truck.name,
            })) || []
        )
    }, [selectedUnloading])

    function onSubmit(data: NewOrders) {
        setData<NewOrders>(DEFAULT_ORDER_VALUE, data)

        const payload = {
            ...data,
            date: format(data.date, "yyyy-MM-dd"),
            start_time: `${format(data.date, "yyyy-MM-dd")}T${data.start_time}`,
        }

        if (currentRow?.id) {
            updateMutate(`${MANAGERS_ORDERS_NEW}/${currentRow.id}`, payload)
        } else {
            postMutate(MANAGERS_ORDERS_CREATE, payload)
        }
    }

    // Reset qilgandagi holat
    const handleReset = () => {
        clearKey(DEFAULT_ORDER_VALUE)
    }

    useEffect(() => {
        if (store) {
            form.reset(store)
        }
    }, [store])

    // Criteria tushirish
    useEffect(() => {
        if (!!data?.criteria?.length) {
            form.setValue("criteria", data?.criteria)
        }
    }, [data?.criteria])

    // Default Value tushirish
    useEffect(() => {
        if (currentRow?.id) {
            form.reset({
                client: currentRow?.client_id,
                truck_type: currentRow?.extra_data?.truck_type,
                comment: currentRow?.comment,
                date: currentRow?.date || format(new Date(), "yyyy-MM-dd"),
                start_time: format(new Date(), "HH:mm"),
            })
        }
    }, [form, currentRow])

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid md:grid-cols-2 gap-4"
        >
            <SelectField
                required
                methods={form}
                name="client"
                label="Kompaniya kodi"
                options={codes}
                optionValueKey="value"
                optionLabelKey="label"
            />
            <SelectField
                required
                methods={form}
                name="loading"
                label="Yuklash manzili"
                hintLabel={currentRow?.extra_data?.loading_name}
                options={loadingData}
                isLoading={isLoading}
                isDisabled={!client}
            />
            <SelectField
                required
                methods={form}
                name="unloading"
                label="Yetkazish manzili"
                hintLabel={currentRow?.extra_data?.unloading_name}
                options={unloadingData}
                isDisabled={!loading}
            />
            <SelectField
                required
                methods={form}
                name="product"
                label="Mahsulot"
                options={products}
                isDisabled={!client}
                isLoading={isLoading}
            />
            <SelectField
                required
                methods={form}
                name="truck_type"
                label="Transport"
                options={transports}
                isDisabled={!client}
                isLoading={isLoading}
            />
            {!currentRow?.id && (
                <FormNumberInput
                    required
                    name="truck_count"
                    label="Mashinalar soni"
                    control={form.control}
                    maxLength={2}
                />
            )}
            <FormMultiCombobox
                required
                control={form.control}
                name="criteria"
                label="Mezonlar"
                options={criteria}
                addButtonProps={{
                    disabled: !client,
                }}
            />

            <div className="grid grid-cols-2 gap-3">
                <FormDatePicker
                    required
                    name="date"
                    label="Sana"
                    control={form.control}
                    addButtonProps={{
                        className: "",
                    }}
                />
                <FormInput
                    required
                    name="start_time"
                    label="Vaqt"
                    methods={form}
                    type="time"
                    prefixIcon={
                        <div className="flex items-center pl-1 pt-1 text-foreground">
                            <Clock size={16} />
                        </div>
                    }
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                />
            </div>

            <FormMultiCombobox
                required
                label="To'lov turlari"
                options={options}
                control={form.control}
                name="payment_types"
            />

            <FormCheckbox
                name="is_now"
                label="Hozir qo'yilishi shart"
                control={form.control}
            />
            <div className="md:col-span-2">
                <FormTextarea
                    name="comment"
                    label="Qo'shimcha ma'lumot"
                    methods={form}
                />
            </div>
            <div className="flex items-center justify-end gap-2 md:col-span-2">
                <Button
                    icon={<RotateCcw width={18} />}
                    size={"icon"}
                    type="button"
                    variant={"destructive"}
                    onClick={handleReset}
                />
                <Button
                    className="min-w-36 w-full md:w-max"
                    type="submit"
                    loading={isPending}
                >
                    Saqlash
                </Button>
            </div>
        </form>
    )
}
