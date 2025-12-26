import ParamTabs from "@/components/as-params/tabs"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import HrProfile from "./truck-profile"
import VehicleCashflows from "./truck-profile/truck-cashflows"
import VehicleTrips from "./truck-trips"

function ViewPage({ data }: { data: Human | undefined }) {
    const navigate = useNavigate()
    const options = [
        {
            value: "0",
            label: "Reyslar",
            content: <VehicleTrips />,
        },

        {
            value: "6",
            label: "Boshqa xarajatlar",
            content: <VehicleCashflows />,
        },
    ]

    return (
        <div className="pb-4">
            <div
                className="flex items-center gap-3 mb-4 cursor-pointer"
                onClick={() => navigate({ to: "/truck" })}
            >
                <Button
                    onClick={() => navigate({ to: "/truck" })}
                    className="shrink-0"
                >
                    <ArrowLeft className="h-4" />
                </Button>

                <h1 className="font-bold">Transport ma'lumotlari</h1>
            </div>

            <HrProfile data={data} />
            <ParamTabs options={options} className="gap-1 mt-2" />
        </div>
    )
}

export default ViewPage
