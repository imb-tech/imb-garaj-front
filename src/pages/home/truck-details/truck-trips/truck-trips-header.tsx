import { ParamCombobox } from "@/components/as-params/combobox"
import ParamDateRange from "@/components/as-params/date-picker-range"
import {
    COMMON_SELECTABLE_VEHICLE_TYPE,
    SETTINGS_SELECTABLE_USERS,
} from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"

const TruckTripsHeader = () => {
    const { data: driversData } = useGet<DriversType[]>(
        SETTINGS_SELECTABLE_USERS,
        {
            params: {
                role: "1",
            },
        },
    )

    const { data: vehicleData } = useGet<ListResponse<VehicleType>>(
        COMMON_SELECTABLE_VEHICLE_TYPE,
    )

    return (
        <div className="flex items-center gap-3 mb-3">
            <h1 className="text-xl">Reyslar ro'yxati</h1>
            <div className="flex flex-1 justify-end items-center gap-3">
                <ParamCombobox
                    paramName="drivers"
                    options={driversData ?? []}
                    valueKey="id"
                    labelKey="first_name"
                    label="Haydovchilar"
                    className="w-full"
                    addButtonProps={{
                        className: "!bg-background dark:!bg-secondary",
                    }}
                />

                <ParamCombobox
                    paramName="truck_type"
                    options={vehicleData?.results ?? []}
                    valueKey="id"
                    labelKey="type"
                    label="Transportlar"
                    className="w-full"
                    addButtonProps={{
                        className: "!bg-background dark:!bg-secondary",
                    }}
                />

                <ParamDateRange
                    addButtonProps={{
                        className:
                            "!bg-background dark:!bg-secondary min-w-32 justify-start",
                    }}
                    from="from_date"
                    to="to_date"
                />
            </div>
        </div>
    )
}

export default TruckTripsHeader
