import { FormCombobox } from "@/components/form/combobox"
import { FormDatePicker } from "@/components/form/date-picker"
import { Button } from "@/components/ui/button"
import {
    SETTINGS_SELECTABLE_CARGO_TYPE,
    SETTINGS_SELECTABLE_CLIENT,
    SETTINGS_SELECTABLE_DISTRICT,
    SETTINGS_SELECTABLE_PAYMENT_TYPE,
    TRIPS_ORDERS,
} from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { FormNumberInput } from "@/components/form/number-input"

type ClientType = {
    id: number | string
    name: string
}

const AddTripOrders = () => {
    const queryClient = useQueryClient()
    const { getData, clearKey } = useGlobalStore()
    const { closeModal } = useModal("create")
    const currentTripOrder = getData<TripOrdersRow>(TRIPS_ORDERS)
    const params = useParams({ strict: false })
    const tripId = params?.id
    console.log(tripId)

    const { data: districtsData } = useGet<DistrictType[]>(
        SETTINGS_SELECTABLE_DISTRICT,
        {
            params: {
                model_name: "district",
            },
        },
    )
    const { data: clientData } = useGet<ClientType[]>(
        SETTINGS_SELECTABLE_CLIENT,
        {
            params: {
                model_name: "client",
            },
        },
    )
    const { data: paymentType } = useGet<ClientType[]>(
        SETTINGS_SELECTABLE_PAYMENT_TYPE,
        {
            params: {
                model_name: "payment-type",
            },
        },
    )
    const { data: cargoType } = useGet<ClientType[]>(
        SETTINGS_SELECTABLE_CARGO_TYPE,
        {
            params: {
                model_name: "cargo-type",
            },
        },
    )

    const form = useForm<TripOrdersRow>({
        defaultValues: {
            loading: currentTripOrder?.loading,
            unloading: currentTripOrder?.unloading,
            trip: currentTripOrder?.trip,
            date: currentTripOrder?.date,
            type: currentTripOrder?.type,
            cargo_type: currentTripOrder?.cargo_type,
            client: currentTripOrder?.client,
            payment_type: currentTripOrder?.payments?.[0]?.payment_type,
            currency: currentTripOrder?.payments?.[0]?.currency,
            currency_course: currentTripOrder?.payments?.[0]?.currency_course,
            amount: currentTripOrder?.payments?.[0]?.amount,
        },
    })

    const { handleSubmit, control, reset, watch } = form

    const selectedCurrency = watch("currency")

    const onSuccess = () => {
        toast.success(
            currentTripOrder?.id ?
                "Buyurtma tahrirlandi!"
            :   "Buyurtma qo'shildi!",
        )
        reset()
        clearKey(TRIPS_ORDERS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [TRIPS_ORDERS] })
    }

    const { mutate: create, isPending: creating } = usePost({ onSuccess })
    const { mutate: update, isPending: updating } = usePatch({ onSuccess })

    const isPending = creating || updating

    const onSubmit = (data: TripOrdersRow) => {
        const { currency, currency_course, amount, payment_type, ...rest } =
            data

        const payment: any = {
            currency,
            amount: String(amount),
            payment_type,
        }

        if (currency === 2) {
            payment.currency_course = String(currency_course)
        }

        const formattedData = {
            ...rest,
            trip: tripId,
            payments: [payment],
        }

        if (currentTripOrder?.id) {
            update(`${TRIPS_ORDERS}/${currentTripOrder.id}`, formattedData)
        } else {
            create(TRIPS_ORDERS, formattedData)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
        >
            <FormCombobox
                required
                label="Buyurtma turi"
                name="type"
                control={control}
                options={[
                    { id: 1, name: "Band" },
                    { id: 2, name: "Bo'sh" },
                ]}
                valueKey="id"
                labelKey="name"
                placeholder="Buyurtmani tanlang"
            />
               <FormDatePicker
                required
                label="Reja qilingan yetkazib berish sanasi"
                control={control}
                name="date"
                placeholder="Sanani tanlang"
                className="w-full"
            />
            <FormCombobox
                required
                label="Yuklash manzili"
                name="loading"
                control={control}
                options={districtsData}
                valueKey="id"
                labelKey="name"
                placeholder="Hududni tanlang"
            />
            <FormCombobox
                required
                label="Yuk tushirish manzili"
                name="unloading"
                control={control}
                options={districtsData}
                valueKey="id"
                labelKey="name"
                placeholder="Hududni tanlang"
            />
                <FormCombobox
                required
                label="Yuk egasi"
                name="client"
                control={control}
                options={clientData}
                // valueKey="id"
                // labelKey="name"
                placeholder="Yuk egasini tanlang"
            />
         
            <FormCombobox
                required
                label="Yuk turi"
                name="cargo_type"
                control={control}
                options={cargoType}
                valueKey="id"
                labelKey="name"
                placeholder="Yuk turini tanlang"
            />
            <FormCombobox
                required
                label="To'lov turi"
                name="payment_type"
                control={control}
                options={paymentType || undefined}
                valueKey="id"
                labelKey="name"
                placeholder="To'lov turini tanlang"
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
                    required
                    thousandSeparator=" "
                    name="currency_course"
                    label="Valyuta kursi"
                    placeholder="12 206 UZS"
                    control={control}
                />
            )}

            <FormNumberInput
                required
                name="amount"
                thousandSeparator={" "}
                label="To'lov miqdori"
                placeholder="12 206 000 UZS"
                control={form.control}
            />
            <div className="col-span-2 flex justify-end gap-4 pt-4">
                <Button type="submit" loading={isPending} disabled={isPending}>
                    Saqlash
                </Button>
            </div>
        </form>
    )
}

export default AddTripOrders
