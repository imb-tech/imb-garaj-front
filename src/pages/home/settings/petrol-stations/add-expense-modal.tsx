import { FormCombobox } from "@/components/form/combobox"
import FileUpload from "@/components/form/file-upload"
import { FormNumberInput } from "@/components/form/number-input"
import FormTextarea from "@/components/form/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    MANAGERS_ORDERS,
    PETROL_STATIONS_OTHER_VEHICLES,
    SETTINGS_PETROL_STATIONS,
    VEHICLES,
} from "@/constants/api-endpoints"
import { cn } from "@/lib/utils"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { usePost } from "@/hooks/usePost"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type VehicleOption = {
    id: number
    truck_number: string
    fuel: "methane" | "diesel" | string
}

// Garaj yuritmaydigan firma mashinasi: faqat raqami saqlanadi.
type OtherVehicleOption = {
    id: number
    number: string
}

type OrderOption = {
    id: number
    loading_name?: string | null
    unloading_name?: string | null
}

// Har bir mashinaning yagona `fuel` turi bor — shu qiymatga qarab o'lchov birligi
// aniqlanadi, hech qachon hardcoded "litr" ishlatilmaydi.
const UNIT_LABEL: Record<string, string> = { methane: "m³", diesel: "litr" }

const CURRENCY_OPTIONS = [
    { id: 1, name: "UZS" },
    { id: 2, name: "USD" },
]

type FormValues = {
    vehicle: number | ""
    other_vehicle: number | ""
    amount: string | number | ""
    quantity: string | number | ""
    currency: 1 | 2
    currency_course: string | number | ""
    comment: string
    order: number | ""
    receipt: File | null
}

const AddExpenseModal = ({ stationId }: { stationId: number }) => {
    const queryClient = useQueryClient()
    const { closeModal } = useModal("petrol-expense")

    const form = useForm<FormValues>({
        defaultValues: {
            vehicle: "",
            other_vehicle: "",
            amount: "",
            quantity: "",
            currency: 1,
            currency_course: "",
            comment: "",
            order: "",
            receipt: null,
        },
    })
    const { control, handleSubmit, watch, reset, setValue } = form
    const currency = watch("currency")
    const vehicleId = watch("vehicle")

    const { data: vehiclesData } = useGet<ListResponse<VehicleOption>>(
        VEHICLES,
        { params: { page_size: 1000 } },
    )
    const { data: otherVehicles, refetch: refetchOtherVehicles } =
        useGet<OtherVehicleOption[]>(PETROL_STATIONS_OTHER_VEHICLES)

    const [isOther, setIsOther] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [newNumber, setNewNumber] = useState("")
    const [newComment, setNewComment] = useState("")
    const [addError, setAddError] = useState("")
    const vehicleOptions = (vehiclesData?.results ?? []).map((v) => ({
        id: v.id,
        name: `${v.truck_number} (${UNIT_LABEL[v.fuel] ?? "litr"})`,
    }))
    const selectedVehicle = vehiclesData?.results?.find(
        (v) => v.id === vehicleId,
    )
    const unitLabel = UNIT_LABEL[selectedVehicle?.fuel ?? ""] ?? "litr"

    const { data: ordersData } = useGet<ListResponse<OrderOption>>(
        MANAGERS_ORDERS,
        {
            params: { trip__vehicle: vehicleId, page_size: 1000 },
            enabled: !!vehicleId,
        },
    )
    const orderOptions = (ordersData?.results ?? []).map((o) => ({
        id: o.id,
        name: `${o.loading_name ?? "?"} → ${o.unloading_name ?? "?"}`,
    }))

    useEffect(() => {
        setValue("order", "")
    }, [vehicleId, setValue])

    const { mutate: createOtherVehicle, isPending: isCreating } = usePost({
        onSuccess: (row: any) => {
            toast.success("Mashina qo'shildi")
            setIsAdding(false)
            setNewNumber("")
            setNewComment("")
            setAddError("")
            refetchOtherVehicles().then(() => setValue("other_vehicle", row.id))
        },
        onError: (error: any) => {
            setAddError(error?.response?.data?.number?.[0] || "Saqlab bo'lmadi")
        },
    })

    const { mutate, isPending } = usePost({
        onSuccess: () => {
            toast.success("Chiqim qo'shildi")
            reset()
            queryClient.refetchQueries({
                predicate: (q) =>
                    String(q.queryKey[0]).includes("petrol-stations"),
            })
            closeModal()
        },
    })

    const onSubmit = (values: FormValues) => {
        const fields: Record<string, any> = {
            ...(isOther
                ? { other_vehicle: values.other_vehicle }
                : { vehicle: values.vehicle }),
            amount: Number(values.amount),
            quantity: Number(values.quantity),
            currency: values.currency,
            currency_course:
                values.currency === 2 && values.currency_course !== ""
                    ? Number(values.currency_course)
                    : null,
            comment: values.comment || null,
            order: isOther ? null : values.order || null,
        }

        if (values.receipt instanceof File) {
            const formData = new FormData()
            Object.entries(fields).forEach(([key, value]) => {
                if (value === null || value === undefined) return
                formData.append(key, String(value))
            })
            formData.append("receipt", values.receipt)
            mutate(`${SETTINGS_PETROL_STATIONS}/${stationId}/expense`, formData)
        } else {
            mutate(`${SETTINGS_PETROL_STATIONS}/${stationId}/expense`, fields)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
                <span className="font-medium text-sm">Mashina turi</span>
                <div className="flex gap-2">
                    {[
                        { value: false, label: "Garaj furasi" },
                        { value: true, label: "Boshqa mashina" },
                    ].map((choice) => (
                        <button
                            key={String(choice.value)}
                            type="button"
                            onClick={() => {
                                setIsOther(choice.value)
                                setValue("vehicle", "")
                                setValue("other_vehicle", "")
                                setValue("order", "")
                            }}
                            className={cn(
                                "px-3 py-1.5 rounded-md text-sm border transition-colors",
                                isOther === choice.value
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {choice.label}
                        </button>
                    ))}
                </div>
            </div>

            {isOther ?
                <div className="flex flex-col gap-2">
                    <FormCombobox
                        required
                        control={control}
                        label="Mashina raqami"
                        name="other_vehicle"
                        options={otherVehicles}
                        valueKey="id"
                        labelKey="number"
                        placeholder="Raqamni tanlang"
                    />
                    {isAdding ?
                        <div className="flex flex-col gap-2 rounded-md border p-3">
                            <Input
                                fullWidth
                                autoFocus
                                placeholder="Masalan: 01 198 LMA"
                                value={newNumber}
                                onChange={(event) => {
                                    setNewNumber(event.target.value)
                                    setAddError("")
                                }}
                            />
                            <Input
                                fullWidth
                                placeholder="Izoh (ixtiyoriy)"
                                value={newComment}
                                onChange={(event) =>
                                    setNewComment(event.target.value)
                                }
                            />
                            {!!addError && (
                                <span className="text-destructive text-xs">
                                    {addError}
                                </span>
                            )}
                            <div className="flex gap-2 justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsAdding(false)
                                        setAddError("")
                                    }}
                                >
                                    Bekor qilish
                                </Button>
                                <Button
                                    type="button"
                                    loading={isCreating}
                                    disabled={!newNumber.trim()}
                                    onClick={() =>
                                        createOtherVehicle(
                                            PETROL_STATIONS_OTHER_VEHICLES,
                                            {
                                                number: newNumber.trim(),
                                                comment:
                                                    newComment.trim() || null,
                                            } as any,
                                        )
                                    }
                                >
                                    Qo'shish
                                </Button>
                            </div>
                        </div>
                    :   <button
                            type="button"
                            onClick={() => setIsAdding(true)}
                            className="text-sm text-primary w-max hover:underline"
                        >
                            + Yangi mashina qo'shish
                        </button>
                    }
                </div>
            :   <>
                    <FormCombobox
                        required
                        control={control}
                        label="Mashina"
                        name="vehicle"
                        options={vehicleOptions}
                        valueKey="id"
                        labelKey="name"
                        placeholder="Mashinani tanlang"
                    />
                    <FormCombobox
                        control={control}
                        label="Buyurtma (ixtiyoriy)"
                        name="order"
                        options={orderOptions}
                        valueKey="id"
                        labelKey="name"
                        placeholder={
                            vehicleId ?
                                "Buyurtmani tanlang"
                            :   "Avval mashina tanlang"
                        }
                    />
                </>
            }
            <FormNumberInput
                required
                control={control}
                label={`Miqdori (${unitLabel})`}
                name="quantity"
                placeholder="Ex: 120.5"
                thousandSeparator=" "
                decimalScale={2}
            />
            <FormCombobox
                control={control}
                label="Valyuta"
                name="currency"
                options={CURRENCY_OPTIONS}
                valueKey="id"
                labelKey="name"
            />
            <FormNumberInput
                required
                control={control}
                label="Summa"
                name="amount"
                placeholder="Ex: 1 000 000"
                thousandSeparator=" "
                decimalScale={currency === 2 ? 2 : 0}
            />
            {currency === 2 && (
                <FormNumberInput
                    required
                    control={control}
                    label="Valyuta kursi"
                    name="currency_course"
                    placeholder="Ex: 12 000"
                    thousandSeparator=" "
                    decimalScale={0}
                />
            )}
            <FormTextarea label="Izoh" name="comment" methods={form} />
            <FileUpload
                control={control}
                name="receipt"
                multiple={false}
                isPaste={false}
                hideClearable={true}
                label="Chek (ixtiyoriy)"
            />
            <div className="flex justify-end mt-1">
                <Button className="min-w-32" type="submit" loading={isPending}>
                    Saqlash
                </Button>
            </div>
        </form>
    )
}

export default AddExpenseModal
