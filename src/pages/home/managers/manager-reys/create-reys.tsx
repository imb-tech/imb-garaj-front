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
import { useEffect, useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
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

// Distinct options derived from a list of directions. `picker` pulls the
// `{ id, name }` pair off each row and we de-duplicate by id.
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
            route:
                currentTripOrder?.loading && currentTripOrder?.unloading
                    ? `${currentTripOrder.loading}-${currentTripOrder.unloading}`
                    : null,
            trip: id,
            date: currentTripOrder?.date,
            type: currentTripOrder?.type,
            client: currentTripOrder?.client,
            cargo_type: currentTripOrder?.cargo_type,
            status: currentTripOrder?.status,
        },
    })

    const { handleSubmit, control, reset, watch, setValue } = form

    const routeValue = watch("route")
    const loadingValue = watch("loading")
    const unloadingValue = watch("unloading")
    const clientValue = watch("client")
    const cargoTypeValue = watch("cargo_type")

    // Cascading reset refs
    const prevLoadingRef = useRef(loadingValue)
    const prevUnloadingRef = useRef(unloadingValue)
    const prevClientRef = useRef(clientValue)

    // Single source of truth — one fetch against /common/directions/.
    // Every cascading dropdown + the matched-direction lookup is derived
    // from this response in memory.
    const { data: directionsResponse } = useGet<ListResponse<Direction>>(
        COMMON_DIRECTIONS,
        { params: { page_size: 10000 } },
    )

    const directions = useMemo(
        () => directionsResponse?.results ?? [],
        [directionsResponse],
    )

    // Yo'nalish — "Yuklash → Yuk tushirish" combined pairs.
    const routeOptions = useMemo(() => {
        const seen = new Set<string>()
        const out: { id: string; name: string; load: number; unload: number }[] = []
        for (const d of directions) {
            const key = `${d.load}-${d.unload}`
            if (seen.has(key)) continue
            seen.add(key)
            out.push({
                id: key,
                name: `${d.load_name} → ${d.unload_name}`,
                load: d.load,
                unload: d.unload,
            })
        }
        return out.sort((a, b) => a.name.localeCompare(b.name))
    }, [directions])

    // Yuk egasi — distinct owners for (load, unload).
    const clientsData = useMemo(() => {
        if (!loadingValue || !unloadingValue) return []
        const rows = directions.filter(
            (d) =>
                d.load === Number(loadingValue) &&
                d.unload === Number(unloadingValue),
        )
        return distinctOptions(rows, (d) => ({
            id: d.owner,
            name: d.owner_name,
        }))
    }, [directions, loadingValue, unloadingValue])

    // Yuk turi — distinct cargo types for (load, unload, owner).
    const cargoTypesData = useMemo(() => {
        if (!loadingValue || !unloadingValue || !clientValue) return []
        const rows = directions.filter(
            (d) =>
                d.load === Number(loadingValue) &&
                d.unload === Number(unloadingValue) &&
                d.owner === Number(clientValue),
        )
        return distinctOptions(rows, (d) => ({
            id: d.cargo_type,
            name: d.cargo_type_name,
        }))
    }, [directions, loadingValue, unloadingValue, clientValue])

    // The resolved Direction config — supplies payment_type / currency / amount.
    // On edit, if the saved order already has a `direction` FK, prefer it as a
    // shortcut so we don't depend on the 4 cascading values matching exactly.
    const matchedDirection = useMemo(() => {
        if (currentTripOrder?.direction) {
            const byId = directions.find(
                (d) => d.id === Number(currentTripOrder.direction),
            )
            if (byId) return byId
        }
        if (
            !loadingValue ||
            !unloadingValue ||
            !clientValue ||
            !cargoTypeValue
        )
            return undefined
        return directions.find(
            (d) =>
                d.load === Number(loadingValue) &&
                d.unload === Number(unloadingValue) &&
                d.owner === Number(clientValue) &&
                d.cargo_type === Number(cargoTypeValue),
        )
    }, [
        directions,
        loadingValue,
        unloadingValue,
        clientValue,
        cargoTypeValue,
        currentTripOrder?.direction,
    ])

    // Sync route → loading + unloading
    useEffect(() => {
        if (routeValue) {
            const selected = routeOptions.find((r) => r.id === routeValue)
            if (selected) {
                setValue("loading", selected.load)
                setValue("unloading", selected.unload)
            }
        } else {
            setValue("loading", null)
            setValue("unloading", null)
        }
    }, [routeValue, routeOptions, setValue])

    // When route (loading/unloading) changes → clear client, cargo_type
    useEffect(() => {
        if (
            prevLoadingRef.current !== loadingValue ||
            prevUnloadingRef.current !== unloadingValue
        ) {
            setValue("client", null)
            setValue("cargo_type", null)
            prevLoadingRef.current = loadingValue
            prevUnloadingRef.current = unloadingValue
        }
    }, [loadingValue, unloadingValue, setValue])

    // When client changes → clear cargo_type
    useEffect(() => {
        if (prevClientRef.current !== clientValue) {
            setValue("cargo_type", null)
            prevClientRef.current = clientValue
        }
    }, [clientValue, setValue])

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
            type: data.type,
            client: data.client,
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

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto no-scrollbar-x p-1"
        >
            <FormCombobox
                required
                label="Buyurtma turi"
                name="type"
                control={control}
                options={[
                    { id: 1, name: "Yukli" },
                    { id: 2, name: "Yuksiz" },
                ]}
                valueKey="id"
                labelKey="name"
                placeholder="Buyurtmani tanlang"
            />
            <FormDatePicker
                required
                label="Sana"
                control={control}
                name="date"
                placeholder="Sanani tanlang"
                className="w-full"
            />
            <FormCombobox
                required
                label="Yo'nalish"
                name="route"
                control={control}
                options={routeOptions}
                valueKey="id"
                labelKey="name"
                placeholder="Yo'nalishni tanlang"
                wrapperClassName="col-span-2"
            />
            <FormCombobox
                required
                label="Yuk egasi"
                name="client"
                control={control}
                options={clientsData}
                labelKey="name"
                valueKey="id"
                placeholder="Yuk egasini tanlang"
                addButtonProps={{
                    disabled: !routeValue,
                }}
            />
            <FormCombobox
                required
                label="Yuk turi"
                name={`cargo_type`}
                control={control}
                options={cargoTypesData}
                valueKey="id"
                labelKey="name"
                placeholder="Yuk turini tanlang"
                addButtonProps={{
                    disabled: !routeValue || !clientValue,
                }}
            />
            <FormCombobox
                options={[
                    {
                        id: "0",
                        name: "Kutilmoqda",
                    },
                    {
                        id: "1",
                        name: "Boshlandi",
                    },

                    {
                        id: "5",
                        name: "Yuklash",
                    },
                    {
                        id: "6",
                        name: "Yo'lda",
                    },
                    {
                        id: "7",
                        name: "Tushirish",
                    },
                    {
                        id: "3",
                        name: "Bekor qilindi",
                    },
                    {
                        id: "2",
                        name: "Tugallandi",
                    },
                ]}
                labelKey="name"
                valueKey="id"
                required
                label="Status"
                name="status"
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
