import Modal from "@/components/custom/modal"
import FormInput from "@/components/form/input"
import { FormNumberInput } from "@/components/form/number-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SETTINGS_WAREHOUSE } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { Map, MapPin } from "lucide-react"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { MapComponent } from "../map"

export type WarehouseType = {
    uuid?: string
    name: string
    address: string
    location: [number, number]
}

const AddWarehouse = () => {
    const queryClient = useQueryClient()
    const { closeModal: closeWarehouseModal } = useModal("create")
    const { openModal: openMap, closeModal: closeMap } = useModal("map")

    const { getData, clearKey } = useGlobalStore()

    const currentWarehouse = getData<WarehouseType>(SETTINGS_WAREHOUSE)

    const form = useForm<WarehouseType>({
        defaultValues: currentWarehouse || {
            name: "",
            address: "",
            location: [69.2401, 41.2995],
        },
    })

    const { handleSubmit, reset, control, watch, setValue } = form

    const locationValue = watch("location")
    const coordinates = {
        lat: locationValue?.[1] ?? 41.2995,
        lng: locationValue?.[0] ?? 69.2401,
    }

    const onSuccess = () => {
        toast.success(
            currentWarehouse?.uuid ?
                "Ombor muvaffaqiyatli tahrirlandi!"
            :   "Ombor muvaffaqiyatli qo'shildi!",
        )
        reset()
        clearKey(SETTINGS_WAREHOUSE)
        closeWarehouseModal()
        queryClient.refetchQueries({ queryKey: [SETTINGS_WAREHOUSE] })
    }

    const { mutate: create, isPending: creating } = usePost({ onSuccess })
    const { mutate: update, isPending: updating } = usePatch({ onSuccess })
    const isPending = creating || updating

    const onSubmit = (data: WarehouseType) => {
        if (currentWarehouse?.uuid) {
            update(`${SETTINGS_WAREHOUSE}/${currentWarehouse.uuid}`, data)
        } else {
            create(SETTINGS_WAREHOUSE, data)
        }
    }
    const handleMapOpen = () => {
        openMap()
    }
    const handleMapSelection = () => {
        closeMap()
    }

    const handleAddressFilled = useCallback(
        (address: {
            street: string
            city: string
            region: string
            fullAddress: string
        }) => {
            setValue("address", address.fullAddress, {
                shouldDirty: true,
                shouldValidate: true,
            })
        },
        [setValue],
    )

    const handleCoordinatesChange = useCallback(
        (coords: { lat: number; lng: number }) => {
            setValue("location.0", coords.lng, { shouldDirty: true })
            setValue("location.1", coords.lat, { shouldDirty: true })
        },
        [setValue],
    )

    const currentAddress = watch("address")

    return (
        <>
            <div className="max-h-[80vh] overflow-y-auto p-1">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <FormInput
                                required
                                name="name"
                                label="Ombor nomi"
                                methods={form}
                                placeholder="Misol: 'Asaka Ombori' MChJ"
                            />
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-foreground">
                                        Joylashuv
                                    </label>
                                </div>

                                <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className="p-2 bg-primary/10 rounded-lg">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    {currentAddress ?
                                                        <>
                                                            <p className="text-sm font-medium text-foreground">
                                                                {currentAddress}
                                                            </p>
                                                            <div className="flex gap-4 text-xs text-muted-foreground">
                                                                <span>
                                                                    Kenglik:{" "}
                                                                    {Number(
                                                                        coordinates.lat,
                                                                    ).toFixed(
                                                                        6,
                                                                    )}
                                                                </span>
                                                                <span>
                                                                    Uzunlik:{" "}
                                                                    {Number(
                                                                        coordinates.lng,
                                                                    ).toFixed(
                                                                        6,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </>
                                                    :   <div className="space-y-1">
                                                            <p className="text-sm font-medium text-foreground">
                                                                Joylashuv
                                                                tanlanmagan
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Xaritadan
                                                                joylashuvni
                                                                tanlang yoki
                                                                manzilni
                                                                qidiring
                                                            </p>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant={
                                                    currentAddress ? "outline"
                                                    :   "default"
                                                }
                                                onClick={handleMapOpen}
                                                className="shrink-0"
                                            >
                                                <Map className="w-4 h-4 mr-2" />
                                                Tanlash
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="hidden">
                            <FormNumberInput<WarehouseType>
                                required
                                name="location.0"
                                label="Uzunlik (Longitude)"
                                control={control}
                                decimalScale={6}
                                thousandSeparator=" "
                                decimalSeparator="."
                                allowNegative={false}
                                valueIsNumericString={false}
                            />
                            <FormNumberInput<WarehouseType>
                                required
                                name="location.1"
                                label="Kenglik (Latitude)"
                                control={control}
                                decimalScale={6}
                                thousandSeparator=" "
                                decimalSeparator="."
                                allowNegative={false}
                                valueIsNumericString={false}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="submit"
                            variant={"default2"}
                            loading={isPending}
                            className="min-w-32"
                            disabled={!currentAddress}
                        >
                            {isPending ? "Saqlanmoqda..." : "Saqlash"}
                        </Button>
                    </div>
                </form>
            </div>
            <Modal
                size="max-w-4xl"
                title="Xaritdada belgilash"
                className={""}
                modalKey="map"
            >
                <MapComponent
                    coordinates={coordinates}
                    onCoordinatesChange={handleCoordinatesChange}
                    onAddressFilled={handleAddressFilled}
                    showSearch={true}
                    showMapControls={true}
                    showCurrentLocationBtn={true}
                    searchPlaceholder="Manzilni qidirish..."
                    mapHeight="500px"
                    className="rounded-lg"
                />{" "}
                <div className="flex items-end justify-end">
                    <Button
                        type="button"
                        variant={"default2"}
                        onClick={handleMapSelection}
                        disabled={!currentAddress}
                    >
                        Tanlashni tasdiqlash
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default AddWarehouse
