import { DataTable } from "@/components/ui/datatable"
import { useGet } from "@/hooks/useGet"
import { ORDER_CASHFLOWS } from "@/constants/api-endpoints"
import { useCostCols } from "./cols"
import { useSearch } from "@tanstack/react-router"




const TripOrderDetailRow = () => {
    const search = useSearch({ strict: false })
    const orderId = Number(search.order)
    const { data, isLoading } = useGet<ListResponse<CashflowRow>>(
        ORDER_CASHFLOWS,
        {
            params: { order: orderId },

        }
    )

    const columns = useCostCols()



    return (
        <div className="space-y-3 border-t p-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-medium">Xarajatlar ro'yxati</h3>
                </div>


            </div>



            <DataTable
                loading={isLoading}
                columns={columns}
                data={data?.results}
                numeration

                paginationProps={{
                    totalPages: data?.total_pages ?? 1,
                }}
            />





        </div>
    )
}

export default TripOrderDetailRow
