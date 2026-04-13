import { FormCombobox } from "@/components/form/combobox"
import { FormDatePicker } from "@/components/form/date-picker"
import { Button } from "@/components/ui/button"
import {
    COMMON_DIRECTIONS,
    MANAGERS_ORDERS,
    TRIPS_ORDERS,
} from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "@tanstack/react-router"
import { ImageIcon, X } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"
import { useController, useForm } from "react-hook-form"
import { toast } from "sonner"

type Option = { id: number; name: string }

type Direction = {
    id: number
    owner: number
    owner_name: string
    load: number
    load_name: string
    unload: number
    unload_name: string
    cargo_type: number
    cargo_type_name: string
    payment_type: number
    currency: 1 | 2
    amount: string | null
}

const distinctOptions = (
    rows: Direction[],
    picker: (d: Direction) => { id: number; name: string },
): Option[] => {
    const seen = new Set<number>()
    const out: Option[] = []
    for (const row of rows) {
        const { id, name } = picker(row)
        if (seen.has(id)) continue
        seen.add(id)
        out.push({ id, name })
    }
    return out.sort((a, b) => a.name.localeCompare(b.name))
}

const AddTripOrders = () => {
    const { id } = useParams({ strict: false })
    const queryClient = useQueryClient()
    const { getData, clearKey } = useGlobalStore()
    const { closeModal } = useModal(MANAGERS_ORDERS)
    const currentTripOrder = getData<TripOrdersRow>(MANAGERS_ORDERS)

    const form = useForm<any>({
        defaultValues: {
            loading: currentTripOrder?.loading,
            unloading: currentTripOrder?.unloading,
            trip: id,
            date: currentTripOrder?.date ?? new Date().toISOString().split("T")[0],
            cargo_type: currentTripOrder?.cargo_type,
            status: currentTripOrder?.status,
            rasm: null,
        },
    })

    const { handleSubmit, control, reset, watch, setValue } = form

    const loadingValue = watch("loading")
    const unloadingValue = watch("unloading")
    const cargoTypeValue = watch("cargo_type")

    const prevLoadingRef = useRef(loadingValue)
    const prevUnloadingRef = useRef(unloadingValue)

    const { data: directionsResponse } = useGet<ListResponse<Direction>>(
        COMMON_DIRECTIONS,
        { params: { page_size: 10000 } },
    )

    const directions = useMemo(
        () => directionsResponse?.results ?? [],
        [directionsResponse],
    )

    const loadsData = useMemo(
        () =>
            distinctOptions(directions, (d) => ({
                id: d.load,
                name: d.load_name,
            })),
        [directions],
    )

    const unloadsData = useMemo(() => {
        if (!loadingValue) return []
        const rows = directions.filter((d) => d.load === Number(loadingValue))
        return distinctOptions(rows, (d) => ({
            id: d.unload,
            name: d.unload_name,
        }))
    }, [directions, loadingValue])

    const cargoTypesData = useMemo(() => {
        if (!loadingValue || !unloadingValue) return []
        const rows = directions.filter(
            (d) =>
                d.load === Number(loadingValue) &&
                d.unload === Number(unloadingValue),
        )
        return distinctOptions(rows, (d) => ({
            id: d.cargo_type,
            name: d.cargo_type_name,
        }))
    }, [directions, loadingValue, unloadingValue])

    const matchedDirection = useMemo(() => {
        if (currentTripOrder?.direction) {
            const byId = directions.find(
                (d) => d.id === Number(currentTripOrder.direction),
            )
            if (byId) return byId
        }
        if (!loadingValue || !unloadingValue || !cargoTypeValue) return undefined
        return directions.find(
            (d) =>
                d.load === Number(loadingValue) &&
                d.unload === Number(unloadingValue) &&
                d.cargo_type === Number(cargoTypeValue),
        )
    }, [
        directions,
        loadingValue,
        unloadingValue,
        cargoTypeValue,
        currentTripOrder?.direction,
    ])

    useEffect(() => {
        if (prevLoadingRef.current !== loadingValue) {
            setValue("unloading", null)
            setValue("cargo_type", null)
            prevLoadingRef.current = loadingValue
        }
    }, [loadingValue, setValue])

    useEffect(() => {
        if (prevUnloadingRef.current !== unloadingValue) {
            setValue("cargo_type", null)
            prevUnloadingRef.current = unloadingValue
        }
    }, [unloadingValue, setValue])

    const onSuccess = () => {
        toast.success(
            currentTripOrder?.id ?
                "Buyurtma tahrirlandi!"
            :   "Buyurtma qo'shildi!",
        )
        reset()
        clearKey(TRIPS_ORDERS)
        closeModal()
        queryClient.refetchQueries({ queryKey: [MANAGERS_ORDERS] })
    }

    const { mutate: create, isPending: creating } = usePost({ onSuccess })
    const { mutate: update, isPending: updating } = usePatch({ onSuccess })
    const isPending = creating || updating

    const onSubmit = (data: any) => {
        if (!matchedDirection) {
            toast.error(
                "Tanlangan yo'nalish uchun sozlama topilmadi. Avval Yo'nalishlar sozlamasida yaratib oling.",
            )
            return
        }

        const incomes = [
            {
                payment_type: matchedDirection.payment_type,
                currency: matchedDirection.currency,
                amount:
                    matchedDirection.amount != null ?
                        String(matchedDirection.amount)
                    :   "0",
            },
        ]

        const formattedData = {
            loading: data.loading,
            unloading: data.unloading,
            date: data.date,
            trip: id,
            status: data?.status,
            cargo_type: data?.cargo_type,
            direction: matchedDirection.id,
            incomes,
        }

        if (currentTripOrder?.id) {
            update(`${MANAGERS_ORDERS}/${currentTripOrder.id}`, formattedData)
        } else {
            create(MANAGERS_ORDERS, formattedData)
        }
    }

    const { field: rasmField } = useController({ name: "rasm", control })
    const rasmInputRef = useRef<HTMLInputElement>(null)
    const rasmPreview =
        rasmField.value instanceof File ?
            URL.createObjectURL(rasmField.value)
        : typeof rasmField.value === "string" ? rasmField.value
        : null

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 max-h-[72vh] overflow-y-auto pr-1 no-scrollbar-x"
        >
            {/* Qayerdan → Qayerga route visual */}
            <div className="flex gap-3">
                {/* Connector */}
                <div className="flex flex-col items-center pt-2.5 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <div
                        className="w-px flex-1 my-1"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(to bottom, hsl(var(--primary)/0.4) 0px, hsl(var(--primary)/0.4) 5px, transparent 5px, transparent 10px)",
                        }}
                    />
                    <div className="w-3 h-3 rounded-full border-2 border-primary bg-background" />
                </div>

                {/* Inputs stacked */}
                <div className="flex flex-col gap-2 flex-1">
                    <FormCombobox
                        required
                        name="loading"
                        control={control}
                        options={loadsData}
                        valueKey="id"
                        labelKey="name"
                        placeholder="Qayerdan"
                    />
                    <FormCombobox
                        required
                        name="unloading"
                        control={control}
                        options={unloadsData}
                        valueKey="id"
                        labelKey="name"
                        placeholder="Qayerga"
                        addButtonProps={{ disabled: !loadingValue }}
                    />
                </div>
            </div>

            {/* Mahsulot turi */}
            <FormCombobox
                required
                label="Mahsulot turi"
                name="cargo_type"
                control={control}
                options={cargoTypesData}
                valueKey="id"
                labelKey="name"
                placeholder="Mahsulot turini tanlang"
                addButtonProps={{
                    disabled: !loadingValue || !unloadingValue,
                }}
            />

            {/* Rasm yuklash */}
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Rasm</span>
                <div
                    className="relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-colors hover:border-primary/60 group"
                    style={{ minHeight: 100 }}
                    onClick={() => rasmInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault()
                        const file = e.dataTransfer.files?.[0]
                        if (file) rasmField.onChange(file)
                    }}
                >
                    {rasmPreview ? (
                        <>
                            <img
                                src={rasmPreview}
                                alt="rasm"
                                className="w-full max-h-48 object-cover"
                            />
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    rasmField.onChange(null)
                                }}
                                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full p-1 hover:bg-destructive hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-2 py-7 text-muted-foreground group-hover:text-primary transition-colors">
                            <ImageIcon size={28} strokeWidth={1.5} />
                            <span className="text-xs">
                                Rasm yuklash yoki bu yerga tashlang
                            </span>
                        </div>
                    )}
                </div>
                <input
                    ref={rasmInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) rasmField.onChange(file)
                    }}
                />
            </div>

            {/* Status */}
            <FormCombobox
                options={[
                    { id: "0", name: "Kutilmoqda" },
                    { id: "1", name: "Boshlandi" },
                    { id: "5", name: "Yuklash" },
                    { id: "6", name: "Yo'lda" },
                    { id: "7", name: "Tushirish" },
                    { id: "3", name: "Bekor qilindi" },
                    { id: "2", name: "Tugallandi" },
                ]}
                labelKey="name"
                valueKey="id"
                required
                label="Status"
                name="status"
                control={form.control}
            />

            {/* Sana */}
            <FormDatePicker
                required
                label="Sana"
                control={control}
                name="date"
                placeholder="Sanani tanlang"
                className="w-full"
            />

            <div className="flex justify-end pt-1">
                <Button type="submit" loading={isPending} disabled={isPending}>
                    Saqlash
                </Button>
            </div>
        </form>
    )
}

export default AddTripOrders
