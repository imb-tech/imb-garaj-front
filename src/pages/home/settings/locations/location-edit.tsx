import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SETTINGS_LOCATIONS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useCallback, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import LocationMap, { type LocationMapRef } from "./location-map"
import type { LocationFeature, LocationList, PolygonGeo } from "./types"

type FormValues = {
    name: string
    address: string
    polygon: PolygonGeo
}

const LocationEditPage = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const params = useParams({ strict: false }) as { id?: string }
    const isEdit = params.id && params.id !== "create"
    const mapRef = useRef<LocationMapRef>(null)

    const { data } = useGet<LocationList>(SETTINGS_LOCATIONS, {
        enabled: !!isEdit,
    })
    const item = isEdit
        ? data?.features?.find(
              (f: LocationFeature) => f.properties.id === Number(params.id),
          )
        : undefined

    const form = useForm<FormValues>({
        defaultValues: { name: "", address: "", polygon: null },
    })

    const { register, handleSubmit, setValue, reset } = form

    useEffect(() => {
        if (item && isEdit) {
            const polygon = item.properties.polygon
            reset({
                name: item.properties.name,
                address: item.properties.address || "",
                polygon: polygon ?? null,
            })
            mapRef.current?.setPolygonsFromData(polygon ?? null)
        }
    }, [item, isEdit, reset])

    const onSuccess = () => {
        queryClient.invalidateQueries({ queryKey: [SETTINGS_LOCATIONS] })
        toast.success(
            isEdit
                ? "Manzil muvaffaqiyatli tahrirlandi!"
                : "Manzil muvaffaqiyatli qo'shildi!",
        )
        navigate({ to: "/locations" })
    }

    const { mutate: postMutate, isPending: isCreating } = usePost({
        onSuccess,
    })
    const { mutate: patchMutate, isPending: isUpdating } = usePatch({
        onSuccess,
    })

    const isPending = isCreating || isUpdating

    const onSubmit = (values: FormValues) => {
        // Derive point from first polygon coordinate
        let pointCoords: [number, number] = [0, 0]
        if (values.polygon?.coordinates?.[0]?.[0]) {
            const [lng, lat] = values.polygon.coordinates[0][0]
            pointCoords = [lng, lat]
        }

        const payload = {
            type: "Feature" as const,
            geometry: {
                type: "Point" as const,
                coordinates: pointCoords,
            },
            properties: {
                name: values.name,
                address: values.address || null,
                polygon: values.polygon,
            },
        }

        if (isEdit) {
            patchMutate(`${SETTINGS_LOCATIONS}/${params.id}`, payload)
        } else {
            postMutate(SETTINGS_LOCATIONS, payload)
        }
    }

    const handlePolygonChange = useCallback(
        (polygon: PolygonGeo) => {
            setValue("polygon", polygon, { shouldDirty: true })
        },
        [setValue],
    )

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate({ to: "/locations" })}
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <CardTitle className="text-lg">
                        {isEdit ? "Manzilni tahrirlash" : "Yangi manzil"}
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <div className="flex flex-col sm:flex-row gap-3">
                        <fieldset className="flex-1">
                            <label className="text-sm font-medium mb-1 block">
                                Nomi{" "}
                                <span className="text-destructive">*</span>
                            </label>
                            <Input
                                placeholder="Manzil nomi"
                                fullWidth
                                {...register("name", {
                                    required: "Nomini kiriting",
                                })}
                            />
                        </fieldset>
                        <fieldset className="flex-1">
                            <label className="text-sm font-medium mb-1 block">
                                Manzil
                            </label>
                            <Input
                                placeholder="Manzil (ixtiyoriy)"
                                fullWidth
                                {...register("address")}
                            />
                        </fieldset>
                    </div>

                    <LocationMap
                        ref={mapRef}
                        onPolygonChange={handlePolygonChange}
                        defaultPolygon={item?.properties?.polygon ?? null}
                    />

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate({ to: "/locations" })}
                        >
                            Bekor qilish
                        </Button>
                        <Button
                            type="submit"
                            className="min-w-32"
                            loading={isPending}
                        >
                            {isEdit ? "Saqlash" : "Qo'shish"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default LocationEditPage
