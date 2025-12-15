import { FormInput } from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { LOGIN } from "@/constants/api-endpoints"
import { usePost } from "@/hooks/usePost"
import { handleFormError } from "@/lib/show-form-errors"
import { createLazyFileRoute } from "@tanstack/react-router"
import { Truck } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export const Route = createLazyFileRoute("/_auth/auth")({
    component: AuthComponent,
})

type Form = {
    username: string
    password: string
}

export function getDeviceInfo() {
    const ua = navigator.userAgent

    let device = "Kompyuter"
    if (/Mobile|Android|iPhone|iPad/i.test(ua)) device = "Telefon"
    if (/Tablet|iPad/i.test(ua)) device = "Planshet"

    let browser = "Noma’lum"
    if (ua.includes("Edg")) browser = "Edge"
    else if (ua.includes("OPR") || ua.includes("Opera")) browser = "Opera"
    else if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome"
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari"
    else if (ua.includes("Firefox")) browser = "Firefox"

    let os = "Noma’lum"
    if (ua.includes("Windows")) os = "Windows"
    else if (ua.includes("Android")) os = "Android"
    else if (ua.includes("Mac OS")) os = "Mac"
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS"
    else if (ua.includes("Linux")) os = "Linux"

    return { device, browser, os }
}

function AuthComponent() {
    const { mutate, isPending } = usePost()

    const [locationAllowed, setLocationAllowed] = useState<boolean | null>(null)
    const [location, setLocation] = useState<{
        lat: number
        lon: number
    } | null>(null)

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setLocationAllowed(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocationAllowed(true)
                setLocation({
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                })
                navigator.geolocation.clearWatch(0)
            },
            (err) => {
                console.warn("Joylashuvga ruxsat berilmadi:", err.message)
                setLocationAllowed(false)
            },
            { enableHighAccuracy: true, timeout: 10000 },
        )
    }, [])

    const form = useForm<Form>({
        disabled: isPending,
    })

    const onSubmit = form.handleSubmit((data) => {
        if (!locationAllowed) {
            alert("Iltimos, tizimga kirish uchun joylashuvga ruxsat bering.")
            return
        }

        mutate(LOGIN, data, {
            onSuccess(res) {
                localStorage.setItem("token", res.access)
                localStorage.setItem("user_id", res.id)
                window.location.href = "/"
            },
            onError: (error) => handleFormError(error, form),
        })
    })

    if (!locationAllowed) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center p-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-red-600">
                        Joylashuvga ruxsat talab qilinadi
                    </h2>
                    <p className="text-gray-300 mb-4">
                        Siz joylashuvga kirishga ruxsat bermagansiz. Iltimos,
                        brauzer sozlamalariga kirib ruxsatni yoqing.
                    </p>
                    <p className="text-gray-300 text-sm mb-4">
                        Chrome uchun: <br />
                        <strong>
                            Settings → Privacy and Security → Site Settings →
                            Location
                        </strong>
                    </p>
                </div>
            </div>
        )
    }

    console.log(location)
    console.log(getDeviceInfo())

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-[url(/volvo-veb.webp)]  bg-cover px-8 pt-8 pb-5 flex-col justify-between relative overflow-hidden bg-center">
                <div className="absolute inset-0 bg-black/50" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                            <Truck className="w-6 h-6 " />
                        </div>
                        <span className="text-2xl font-bold ">
                            IMB LOGISTIKA
                        </span>
                    </div>
                    <div className="h-[55vh] w-full flex flex-col items-center justify-center">
                        <h2 className="text-4xl font-bold  mb-4 leading-tight">
                            Xush kelibsiz!
                        </h2>
                        <p className="text-lg text-center">
                            Yuk tashish ishlarini oson va tartibli boshqarish
                            endi muammo emas. <br /> IMB Logistika — ishonchli,
                            tezkor va qulay tizim siz uchun.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 text-white/90">
                    Mualliflik huquqi © 2025, IMBTECH MChJ. Barcha huquqlar
                    himoyalangan.
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="flex-1 flex items-center justify-center sm:p-8 p-4">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center sm:text-start  mb-2 text-zinc-800">
                        Tizimga kirish
                    </h1>
                    <p className="sm:mb-6 mb-2 text-gray-600 sm:text-lg text-sm">
                        Davom etish uchun ma'lumotlaringizni kiriting
                    </p>
                    <form
                        onSubmit={onSubmit}
                        className=" space-y-4 flex flex-col items-center"
                    >
                        <FormInput
                            name="username"
                            label="Login"
                            methods={form}
                            required
                            className="bg-white border border-primary"
                            wrapperClassName={"text-zinc-800"}
                        />

                        <FormInput
                            name="password"
                            label="Parol"
                            type="password"
                            methods={form}
                            required
                            className="bg-white border border-primary"
                            wrapperClassName={"text-zinc-800"}
                        />

                        <Button
                            type="submit"
                            loading={isPending}
                            className="w-full bg-blue-400 hover:bg-blue-500 text-white"
                        >
                            Kirish
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
