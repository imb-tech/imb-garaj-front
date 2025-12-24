import { VEHICLES } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useParams } from "@tanstack/react-router"
import { CalendarDays, Fuel, Truck, User } from "lucide-react"

type Props = {
    data: any | undefined
}

function TruckProfile({ data }: Props) {
    const params = useParams({ strict: false })
    const id = params.id

    const { data: vehicleDetail } = useGet<VehicleDetailType>(
        `${VEHICLES}/${id}`,
        {
            enabled: !!id,
        },
    )

    return (
        <div
            className="bg-background border border-divider relative rounded-lg p-4 
        grid grid-cols-4 gap-6"
        >
            <div className="flex items-start gap-6 col-span-2">
                {/* Truck rasmi */}
                <div className="border border-divider h-[200px] sm:h-full sm:w-[260px] rounded-lg overflow-hidden">
                    <img
                        alt="Truck"
                        className="w-full h-full object-cover object-center"
                        src={
                            typeof data?.image === "string" ?
                                data.image
                            :   "https://media.wired.com/photos/60f9b8a417ecd990dacf3c75/1:1/w_947,h_947,c_limit/Business-Self-Driving-Trucks-TuSimple.jpg"
                        }
                    />
                </div>

                {/* Truck ma’lumotlari  1*/}

                <div className="flex flex-col gap-2">
                    <div className="font-bold text-2xl mb-2">
                        {vehicleDetail?.truck_number || "Mavjud emas"}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Truck size={18} />
                        <span className="font-medium">
                            {"Avtomobil raqami"}:
                        </span>
                        <span>
                            {vehicleDetail?.truck_number || "Mavjud emas"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <Truck size={18} />
                        <span className="font-medium">
                            {"Avtomobil hujjati"}:
                        </span>
                        <span>
                            {vehicleDetail?.truck_passport || "Mavjud emas"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <User size={18} />
                        <span className="font-medium">{"Haydovchi"}:</span>
                        <span>
                            {vehicleDetail?.driver_name || "Mavjud emas"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <CalendarDays size={18} />
                        <span className="font-medium">
                            {"Ro‘yxatdan o‘tgan sana"}:
                        </span>
                        <span>{data?.register_date || "Mavjud emas"}</span>
                    </div>
                </div>
            </div>

            {/* Truck ma’lumotlari 2 */}
            <div className="flex flex-col gap-2 mt-10">
                <div className="flex items-center gap-2 flex-wrap">
                    <Fuel size={18} />
                    <span className="font-medium">{"Yoqilg'i turlari"}:</span>
                    <span>{vehicleDetail?.fuel}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Fuel size={18} />
                    <span className="font-medium">{"Yoqilg‘i sarfi"}:</span>
                    <span>
                        {vehicleDetail?.consumption || "100 km / 28 litr"}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default TruckProfile
