import { FormCombobox } from "@/components/form/combobox"
import { FormNumberInput } from "@/components/form/number-input"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import {
    ROUTE_CONFIG_KEY,
    useRouteConfigsStore,
    type RouteConfig,
} from "@/store/route-configs-store"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
    CARGO_TYPE_OPTIONS,
    CLIENT_OPTIONS,
    CURRENCY_OPTIONS,
    LOCATION_OPTIONS,
    PAYMENT_TYPE_OPTIONS,
} from "./options"

type FormValues = Omit<RouteConfig, "id">

const AddRouteConfigModal = () => {
    const { closeModal } = useModal("create")
    const { getData, clearKey } = useGlobalStore()
    const current = getData<RouteConfig>(ROUTE_CONFIG_KEY)
    const add = useRouteConfigsStore((s) => s.add)
    const update = useRouteConfigsStore((s) => s.update)

    const form = useForm<FormValues>({
        defaultValues: {
            client: current?.client ?? null,
            loading: current?.loading ?? null,
            unloading: current?.unloading ?? null,
            cargo_type: current?.cargo_type ?? null,
            payment_type: current?.payment_type ?? null,
            currency: current?.currency ?? null,
            amount: current?.amount ?? null,
        },
    })

    const { handleSubmit, control, reset } = form

    const onSubmit = (values: FormValues) => {
        if (current?.id) {
            update(current.id, values)
            toast.success("Yo'nalish tahrirlandi!")
        } else {
            add(values)
            toast.success("Yo'nalish qo'shildi!")
        }
        reset()
        clearKey(ROUTE_CONFIG_KEY)
        closeModal()
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
        >
            <FormCombobox
                required
                label="Yuk egasi"
                name="client"
                control={control}
                options={CLIENT_OPTIONS}
                labelKey="name"
                valueKey="id"
                placeholder="Yuk egasini tanlang"
            />
            <FormCombobox
                required
                label="Yuklash manzili"
                name="loading"
                control={control}
                options={LOCATION_OPTIONS}
                valueKey="id"
                labelKey="name"
                placeholder="Hududni tanlang"
            />
            <FormCombobox
                required
                label="Yuk tushirish manzili"
                name="unloading"
                control={control}
                options={LOCATION_OPTIONS}
                valueKey="id"
                labelKey="name"
                placeholder="Hududni tanlang"
            />
            <FormCombobox
                required
                label="Yuk turi"
                name="cargo_type"
                control={control}
                options={CARGO_TYPE_OPTIONS}
                valueKey="id"
                labelKey="name"
                placeholder="Yuk turini tanlang"
            />
            <FormCombobox
                required
                label="To'lov turi"
                name="payment_type"
                control={control}
                options={PAYMENT_TYPE_OPTIONS}
                valueKey="id"
                labelKey="name"
                placeholder="To'lov turini tanlang"
            />
            <FormCombobox
                required
                label="Valyuta"
                name="currency"
                control={control}
                options={CURRENCY_OPTIONS}
                valueKey="id"
                labelKey="name"
                placeholder="Valyutani tanlang"
            />
            <FormNumberInput
                required
                thousandSeparator=" "
                name="amount"
                label="Summa"
                placeholder="12 206 000"
                control={control}
            />

            <div className="col-span-2 flex items-center justify-end mt-3">
                <Button className="min-w-36" type="submit">
                    Saqlash
                </Button>
            </div>
        </form>
    )
}

export default AddRouteConfigModal
