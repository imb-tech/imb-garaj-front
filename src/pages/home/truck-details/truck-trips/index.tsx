
import { DataTable } from "@/components/ui/datatable"
import { TRIPS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate, useParams } from "@tanstack/react-router"
import { useCostCols } from "./cols"
import ParamInput from "@/components/as-params/input"

const VehicleTrips = () => {
    const navigate = useNavigate()
    const params = useParams({ strict: false })
    const { data, isLoading } = useGet<ListResponse<TripRow>>(TRIPS, {
        params: {
            vehicle: params.id
        }
    })
    const columns = useCostCols()

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
                <ParamInput name="driver_name" fullWidth searchKey="driver_name" />
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
