import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useNavigate, useParams } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useCallback, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import LocationMap, { type LocationMapRef } from "./location-map"
import { MOCK_LOCATIONS } from "./mock-data"
import type { LocationItem } from "./types"

type FormValues = {
    name: string
    type: "loading" | "unloading"
    polygon: LocationItem["polygon"]
}

const LOCATION_TYPES = [
    { value: "loading", label: "Yuklash" },
    { value: "unloading", label: "Tushirish" },
] as const

const LocationEditPage = () => {
    const navigate = useNavigate()
    const params = useParams({ strict: false }) as { id?: string }
    const isEdit = params.id && params.id !== "create"
    const mapRef = useRef<LocationMapRef>(null)

    // TODO: Replace with useGet when backend is ready
    const item = isEdit
        ? MOCK_LOCATIONS.find((l) => l.id === Number(params.id))
        : undefined

    const form = useForm<FormValues>({
        defaultValues: { name: "", type: "loading", polygon: null },
    })

    const { register, handleSubmit, setValue, watch, reset } = form
    const currentType = watch("type")

    useEffect(() => {
        if (item && isEdit) {
            reset({
                name: item.name,
                type: item.type,
                polygon: item.polygon,
            })
            mapRef.current?.setPolygonsFromData(item.polygon)
        }
    }, [item, isEdit, reset])

    // TODO: Replace with usePost/usePatch when backend is ready
    const onSubmit = (values: FormValues) => {
        console.log("Location payload:", values)
        toast.info("Backend hali tayyor emas. Ma'lumot consolega chiqarildi.")
    }

    const handlePolygonChange = useCallback(
        (polygon: LocationItem["polygon"]) => {
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
                        <fieldset className="sm:w-[200px]">
                            <label className="text-sm font-medium mb-1 block">
                                Turi{" "}
                                <span className="text-destructive">*</span>
                            </label>
                            <div className="flex rounded-lg border overflow-hidden h-9">
                                {LOCATION_TYPES.map((t) => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() =>
                                            setValue("type", t.value)
                                        }
                                        className={cn(
                                            "flex-1 text-sm font-medium transition-colors",
                                            currentType === t.value
                                                ? t.value === "loading"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-orange-500 text-white"
                                                : "hover:bg-accent",
                                        )}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <LocationMap
                        ref={mapRef}
                        onPolygonChange={handlePolygonChange}
                        defaultPolygon={item?.polygon}
                    />

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate({ to: "/locations" })}
                        >
                            Bekor qilish
                        </Button>
                        <Button type="submit" className="min-w-32">
                            {isEdit ? "Saqlash" : "Qo'shish"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default LocationEditPage
