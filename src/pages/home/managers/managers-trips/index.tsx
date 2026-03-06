import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import { MANAGERS_TRIPS, MANAGERS_VEHICLES } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { formatMoney } from "@/lib/format-money"
import { useGlobalStore } from "@/store/global-store"
import { useNavigate, useParams } from "@tanstack/react-router"
import { ArrowLeft, Plus } from "lucide-react"
import { useColumnsManagersTrips } from "./cols"
import CreateManagerTrips from "./create"

export default function ManagersTrips() {
    const { setData, getData } = useGlobalStore()
    const { openModal: createTripModal } = useModal(MANAGERS_TRIPS)
    const { openModal: deleteTrip } = useModal(`${MANAGERS_TRIPS}-delete`)
    const navigate = useNavigate()
    const { id } = useParams({ strict: false })
    const { data, isLoading } = useGet<ListResponse<ManagerTrips>>(
        MANAGERS_TRIPS,
        {
            params: {
                vehicle: id,
            },
        },
    )

    const item = getData(MANAGERS_VEHICLES)
    const handleBack = () => {
        navigate({ to: "/managers" })
    }
    const handleRowClick = (item: ManagerTrips) => {
        setData("manager-trips", item)
        const id = item?.id
        if (!id) return
        navigate({
            to: "/manager-trips/manager-reys/$id",
            params: { id: id.toString() },
        })
    }
    const cols = useColumnsManagersTrips()
    const handleEdit = (item: ManagerTrips) => {
        setData(MANAGERS_TRIPS, item)
        createTripModal()
    }
    const handleDelete = (item: ManagerTrips) => {
        setData(MANAGERS_TRIPS, item)
        deleteTrip()
    }

    const handleAdd = () => {
        createTripModal()
    }
    return (
        <>
            <DataTable
                loading={isLoading}
                numeration
                data={data?.results}
                columns={cols}
                onRowClick={handleRowClick}
                onEdit={(row) => handleEdit(row.original)}
                onDelete={(row) => handleDelete(row.original)}
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
                                    {item?.truck_number || "nimadir"}
                                </h1>
                            </div>
                            <Button onClick={handleAdd}>
                                <Plus size={16} />
                                Qo'shish
                            </Button>
                        </div>
                    </div>
                }
            />

            <Modal modalKey={MANAGERS_TRIPS} title>
                <CreateManagerTrips />
            </Modal>
            <DeleteModal
                path={MANAGERS_TRIPS}
                id={item?.id}
                modalKey={`${MANAGERS_TRIPS}-delete`}
            ></DeleteModal>
        </>
    )
}
