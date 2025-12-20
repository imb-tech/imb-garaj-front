import Modal from "@/components/custom/modal"
import { FormCheckbox } from "@/components/form/checkbox"
import { FormFormatNumberInput } from "@/components/form/format-number-input"
import FormInput from "@/components/form/input"
import FormTextarea from "@/components/form/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SETTINGS_CUSTOMERS } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useGlobalStore } from "@/store/global-store"
import { useQueryClient } from "@tanstack/react-query"
import { Clock, Map, MapPin } from "lucide-react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { MapComponent } from "../map"

const AddCustomersModal = () => {
    const queryClient = useQueryClient()
    const { closeModal: closeCustomerModal } = useModal("create")
    const { openModal: openMap, closeModal: closeMap } = useModal("map")
    const { getData, clearKey } = useGlobalStore()

    const currentCustomer = getData<CustomersType>(SETTINGS_CUSTOMERS)

    const getDefaultValues = (): CustomerFormType => {
        if (currentCustomer) {
            // Convert coordinates to [string, string] tuple
            const coordinates: [string, string] =
                currentCustomer.coordinates ?
                    [
                        currentCustomer.coordinates[0]?.toString() || "",
                        currentCustomer.coordinates[1]?.toString() || "",
                    ]
                :   ["", ""]

            // Convert loading_coordinates to [string, string] tuple
            const loadingCoordinates: [string, string] =
                currentCustomer.loading_coordinates ?
                    [
                        currentCustomer.loading_coordinates[0]?.toString() ||
                            "",
                        currentCustomer.loading_coordinates[1]?.toString() ||
                            "",
                    ]
                :   ["", ""]

            const schedules: ScheduleFormType[] = []

            for (let i = 0; i < 7; i++) {
                const existingSchedule = currentCustomer.schedules?.find(
                    (s) => s.day_of_week === i,
                )

                if (existingSchedule) {
                    schedules.push({
                        day_of_week: i,
                        start_time: existingSchedule.start_time.substring(0, 5),
                        end_time: existingSchedule.end_time.substring(0, 5),
                        enabled: true,
                    })
                } else {
                    schedules.push({
                        day_of_week: i,
                        start_time: "09:00",
                        end_time: "18:00",
                        enabled: false,
                    })
                }
            }

            return {
                name: currentCustomer.name || "",
                company_name: currentCustomer.company_name || "",
                address: currentCustomer.address || "",
                loading_coordinates: loadingCoordinates,
                loading_address: currentCustomer.loading_address || "",
                coordinates: coordinates,
                phone_number: currentCustomer.phone_number || "",
                email: currentCustomer.email || "",
                note: currentCustomer.note || "",
                schedules,
            }
        }

        return {
            name: "",
            company_name: "",
            address: "",
            loading_coordinates: ["", ""],
            loading_address: "",
            coordinates: ["", ""],
            phone_number: "",
            email: "",
            note: "",
            schedules: Array(7)
                .fill(null)
                .map((_, index) => ({
                    day_of_week: index,
                    start_time: "09:00",
                    end_time: "18:00",
                    enabled: false,
                })),
        }
    }

    const form = useForm<CustomerFormType>({
        defaultValues: getDefaultValues(),
    })

    const { handleSubmit, control, watch, setValue } = form

    const coordinates = {
        lat: parseFloat(watch("coordinates.1")) || 41.2995,
        lng: parseFloat(watch("coordinates.0")) || 69.2401,
    }

    const loadingCoordinates = {
        lat: parseFloat(watch("loading_coordinates.1")) || 41.2995,
        lng: parseFloat(watch("loading_coordinates.0")) || 69.2401,
    }

    const onSuccess = () => {
        toast.success(
            `Mijoz muvaffaqiyatli ${currentCustomer?.id ? "tahrirlandi!" : "qo'shildi"} `,
        )

        clearKey(SETTINGS_CUSTOMERS)
        closeCustomerModal()
        queryClient.invalidateQueries({ queryKey: [SETTINGS_CUSTOMERS] })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({
        onSuccess,
    })

    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({
        onSuccess,
    })

    const isPending = isPendingCreate || isPendingUpdate

    const handleMainAddressFilled = useCallback(
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

    const handleLoadingAddressFilled = useCallback(
        (address: {
            street: string
            city: string
            region: string
            fullAddress: string
        }) => {
            setValue("loading_address", address.fullAddress, {
                shouldDirty: true,
                shouldValidate: true,
            })
        },
        [setValue],
    )

    const handleMainCoordinatesChange = useCallback(
        (coords: { lat: number; lng: number }) => {
            setValue("coordinates.0", coords.lng.toString(), {
                shouldDirty: true,
            })
            setValue("coordinates.1", coords.lat.toString(), {
                shouldDirty: true,
            })
        },
        [setValue],
    )

    const handleLoadingCoordinatesChange = useCallback(
        (coords: { lat: number; lng: number }) => {
            setValue("loading_coordinates.0", coords.lng.toString(), {
                shouldDirty: true,
            })
            setValue("loading_coordinates.1", coords.lat.toString(), {
                shouldDirty: true,
            })
        },
        [setValue],
    )

    const [currentMapType, setCurrentMapType] = useState<"main" | "loading">(
        "main",
    )

    const handleMapOpen = (type: "main" | "loading") => {
        setCurrentMapType(type)
        openMap()
    }

    const handleMapSelection = () => {
        closeMap()
    }

    const onSubmit = (values: CustomerFormType) => {
        const enabledSchedules = values.schedules
            .filter((schedule) => schedule.enabled)
            .map((schedule) => ({
                day_of_week: schedule.day_of_week,
                start_time: `${schedule.start_time}:00`,
                end_time: `${schedule.end_time}:00`,
            }))

        const coordinates = [
            parseFloat(values.coordinates[0]) || 0,
            parseFloat(values.coordinates[1]) || 0,
        ]

        const loading_coordinates =
            values.loading_coordinates[0] && values.loading_coordinates[1] ?
                [
                    parseFloat(values.loading_coordinates[0]) || 0,
                    parseFloat(values.loading_coordinates[1]) || 0,
                ]
            :   null

        const formattedValues = {
            name: values.name,
            company_name: values.company_name,
            address: values.address,
            coordinates: coordinates,
            loading_coordinates: loading_coordinates,
            loading_address: values.loading_address || "",
            phone_number: values.phone_number,
            email: values.email,
            note: values.note,
            schedules: enabledSchedules,
        }

        if (currentCustomer?.id) {
            updateMutate(
                `${SETTINGS_CUSTOMERS}/${currentCustomer.uuid}`,
                formattedValues,
            )
        } else {
            postMutate(SETTINGS_CUSTOMERS, formattedValues)
        }
    }

    const currentAddress = watch("address")
    const currentLoadingAddress = watch("loading_address")

    return (
        <>
            <div className="max-h-[80vh] overflow-y-auto   p-1">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                    <div className="space-y-4">
                        <FormInput
                            required
                            name="name"
                            label="F.I.O"
                            methods={form}
                            placeholder="Azamat Samandarov"
                        />
                        <FormInput
                            required
                            name="company_name"
                            label="Tashkilot nomi"
                            placeholder="Misol: 'UzAuto Motors' MChJ"
                            methods={form}
                        />

                        {/* Main Address Map Selection */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">
                                    Asosiy manzil
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
                                                                ).toFixed(6)}
                                                            </span>
                                                            <span>
                                                                Uzunlik:{" "}
                                                                {Number(
                                                                    coordinates.lng,
                                                                ).toFixed(6)}
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
                                                            joylashuvni tanlang
                                                            yoki manzilni
                                                            qidiring
                                                        </p>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant={
                                                currentAddress ? "outline" : (
                                                    "default"
                                                )
                                            }
                                            onClick={() =>
                                                handleMapOpen("main")
                                            }
                                            className="shrink-0"
                                        >
                                            <Map className="w-4 h-4 mr-2" />
                                            Tanlash
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <FormFormatNumberInput
                            control={form.control}
                            format="+998 ## ### ## ##"
                            placeholder="Misol:+998 99 999 99 99"
                            required
                            label={"Telefon"}
                            name={"phone_number"}
                        />
                        <FormInput
                            required
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="azamatsamandarov@gmail.com"
                            methods={form}
                        />

                        {/* Loading Address Map Selection */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-foreground">
                                    Yuk olish manzili (ixtiyoriy)
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
                                                {currentLoadingAddress ?
                                                    <>
                                                        <p className="text-sm font-medium text-foreground">
                                                            {
                                                                currentLoadingAddress
                                                            }
                                                        </p>
                                                        <div className="flex gap-4 text-xs text-muted-foreground">
                                                            <span>
                                                                Kenglik:{" "}
                                                                {Number(
                                                                    loadingCoordinates.lat,
                                                                ).toFixed(6)}
                                                            </span>
                                                            <span>
                                                                Uzunlik:{" "}
                                                                {Number(
                                                                    loadingCoordinates.lng,
                                                                ).toFixed(6)}
                                                            </span>
                                                        </div>
                                                    </>
                                                :   <div className="space-y-1">
                                                        <p className="text-sm font-medium text-foreground">
                                                            Yuk olish manzili
                                                            tanlanmagan
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Yuk olish manzilini
                                                            xaritadan tanlang
                                                        </p>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant={
                                                currentLoadingAddress ?
                                                    "outline"
                                                :   "default"
                                            }
                                            onClick={() =>
                                                handleMapOpen("loading")
                                            }
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

                    <div>
                        <div className="text-sm font-medium mb-1.5">
                            Ish jadvali
                        </div>

                        <div className="space-y-3 max-h-[400px] pr-2">
                            {weekDays.map((day, index) => {
                                return (
                                    <div
                                        key={day.id}
                                        className="flex items-start gap-3 p-3 border rounded-lg"
                                    >
                                        <div className="min-w-[100px] pt-2">
                                            <FormCheckbox
                                                control={control}
                                                name={`schedules.${index}.enabled`}
                                                label={day.label}
                                            />
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <FormInput
                                                    prefixIcon={
                                                        <Clock className="h-4 w-4" />
                                                    }
                                                    methods={form}
                                                    name={`schedules.${index}.start_time`}
                                                    type="time"
                                                    disabled={
                                                        !watch(
                                                            `schedules.${index}.enabled`,
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <FormInput
                                                    prefixIcon={
                                                        <Clock className="h-4 w-4" />
                                                    }
                                                    methods={form}
                                                    name={`schedules.${index}.end_time`}
                                                    type="time"
                                                    disabled={
                                                        !watch(
                                                            `schedules.${index}.enabled`,
                                                        )
                                                    }
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <FormTextarea
                        wrapperClassName={"lg:col-span-2"}
                        name="note"
                        label="Izoh"
                        methods={form}
                    />

                    <div className="flex items-center justify-end lg:col-span-2">
                        <Button
                            variant={"default2"}
                            className="min-w-36"
                            type="submit"
                            loading={isPending}
                            disabled={!currentAddress}
                        >
                            Saqlash
                        </Button>
                    </div>
                </form>
            </div>

            {/* Map Modal */}
            <Modal
                size="max-w-4xl"
                title={
                    currentMapType === "main" ?
                        "Asosiy manzilni tanlash"
                    :   "Yuk olish manzilini tanlash"
                }
                className=""
                modalKey="map"
            >
                <div className="space-y-4">
                    <MapComponent
                        coordinates={
                            currentMapType === "main" ? coordinates : (
                                loadingCoordinates
                            )
                        }
                        onCoordinatesChange={
                            currentMapType === "main" ?
                                handleMainCoordinatesChange
                            :   handleLoadingCoordinatesChange
                        }
                        onAddressFilled={
                            currentMapType === "main" ?
                                handleMainAddressFilled
                            :   handleLoadingAddressFilled
                        }
                        showSearch={true}
                        showMapControls={true}
                        showCurrentLocationBtn={true}
                        searchPlaceholder="Manzilni qidirish..."
                        mapHeight="500px"
                        className="rounded-lg"
                    />
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm">
                            <div className="font-medium text-foreground">
                                Tanlangan manzil:
                            </div>
                            <div className="text-muted-foreground mt-1">
                                {currentMapType === "main" ?
                                    currentAddress || "Tanlanmagan"
                                :   currentLoadingAddress || "Tanlanmagan"}
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="default2"
                            onClick={handleMapSelection}
                            disabled={
                                currentMapType === "main" ? !currentAddress : (
                                    !currentLoadingAddress
                                )
                            }
                        >
                            Tanlashni tasdiqlash
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AddCustomersModal

const weekDays = [
    { id: 0, label: "Yakshanba" },
    { id: 1, label: "Dushanba" },
    { id: 2, label: "Seshanba" },
    { id: 3, label: "Chorshanba" },
    { id: 4, label: "Payshanba" },
    { id: 5, label: "Juma" },
    { id: 6, label: "Shanba" },
]
