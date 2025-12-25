
import { DataTable } from "@/components/ui/datatable"
import { COMMON_SELECTABLE_VEHICLE_TYPE, SETTINGS_SELECTABLE_USERS, TRIPS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { useCostCols } from "./cols"
import { ParamCombobox } from "@/components/as-params/combobox"
import ParamDateRange from "@/components/as-params/date-picker-range"

const VehicleTrips = () => {
    const navigate = useNavigate()
    const params = useParams({ strict: false })
    const search = useSearch({ strict: false })
    const { data, isLoading } = useGet<ListResponse<TripRow>>(TRIPS, {
        params: {
            vehicle: params.id,
            ...search
        }
    })
    const columns = useCostCols()

    const { data: driversData } = useGet<DriversType[]>(SETTINGS_SELECTABLE_USERS, {
        params: {
            role: "1"
        }
    })

    const { data: vehicleData } = useGet<ListResponse<VehicleType>>(COMMON_SELECTABLE_VEHICLE_TYPE)

    const handleRowClick = (item: TripRow) => {
        const id = item?.id
        if (!id) return
        navigate({
            to: "/orders/$id",
            params: { id: id.toString() },
        })
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-3 gap-4">

            </div>

            <DataTable
                loading={isLoading}
                columns={columns}
                data={data?.results}
                numeration
                onRowClick={handleRowClick}
                head={
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-xl">Reyslar ro'yxati</h1>
                        <div className="flex flex-1 justify-end items-center gap-3">
                            <ParamCombobox
                                paramName="drivers"
                                options={driversData ?? [] }
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
                }
                paginationProps={{
                    totalPages: 3,
                }}
            />



        </div>
    )
}

export default VehicleTrips
