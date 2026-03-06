import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import { MANAGERS_ORDERS, MANAGERS_VEHICLES } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { formatMoney } from "@/lib/format-money"
import { useGlobalStore } from "@/store/global-store"
import { useNavigate, useParams } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useColumnsManagersVehicles } from "../cols"

export default function ManagerReys() {
    const { setData, getData } = useGlobalStore()
    const item = getData(MANAGERS_VEHICLES)
    const { id } = useParams({ strict: false })
    const currentSelected = getData("manager-trips")
    const { data } = useGet(`${MANAGERS_ORDERS}`, {
        params: {
            trip: id,
        },
    })
    const navigate = useNavigate()
    const cols = useColumnsManagersVehicles()
    function handleBack() {
        navigate({
            to: "/manager-trips/$id",
            params: {
                id: item?.id.toString(),
            },
        })
    }
    return (
        <>
            <DataTable
                columns={cols}
                data={data?.results || []}
                head={
                    <div className=" mb-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Button onClick={handleBack}>
                                    <ArrowLeft size={14} />
                                </Button>
                                <h1 className="text-xl">Aylanmalar</h1>
                                <Badge>{formatMoney(data?.count)}</Badge>
                                <span>/</span>
                                <h1 className="text-[14px] text-primary">
                                    {currentSelected?.driver_number || "nimadir"}
                                </h1>
                            </div>
                            {/* <ParamSwtich label="Arxiv" paramName="archive" /> */}
                        </div>
                    </div>
                }
            />
        </>
    )
}
