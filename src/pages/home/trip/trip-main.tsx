import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import Modal from "@/components/custom/modal"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useNavigate } from "@tanstack/react-router"
import { formatMoney } from "@/lib/format-money"
import { useCostCols } from "./cols"
import DeleteModal from "@/components/custom/delete-modal"
import { TRIPS } from "@/constants/api-endpoints"
import AddTrip from "./create"



const ShiftStatisticMain = () => {
    const navigate = useNavigate()
    const { getData, setData, clearKey } = useGlobalStore()
    const { openModal: openCreateModal, closeModal: closeCreateModal } = useModal("create")
    const { openModal: openDeleteModal } = useModal("delete")

    const currentTrip = getData<TripRow>(TRIPS) 


    const { data, isLoading } = useGet<ListResponse<TripRow>>(TRIPS)


    const columns = useCostCols()

    const handleCreate = () => {
        clearKey(TRIPS)
        openCreateModal()
    }

    const handleEdit = (item: any) => {
        setData(TRIPS, item)
        openCreateModal()
    }

       const handleDelete = (row: { original:any}) => {
        setData(TRIPS, row.original)
        openDeleteModal()
    }


    const { data: dataCard } = useGet<CardMain>("", {
        // params: search,
        options: { enabled: false }, // disable if not used
    })

    return (
        <div className="space-y-3">
            <div className="flex sm:justify-end mb-3">
                <Button onClick={handleCreate}>
                    Reys qo'shish +
                </Button>
            </div>

            <DataTable
                loading={isLoading}
                columns={columns}
                data={data?.results}
                numeration
                onEdit={({ original }) => handleEdit(original)}
                onDelete={handleDelete}
                onRowClick={() =>
                    navigate({ to: "/trip-orders/$id", params: { id: "2" } })
                }
                head={
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-xl">Reyslar ro'yxati</h1>
                        <Badge className="text-sm">{formatMoney(25)}</Badge>
                    </div>
                }
                paginationProps={{
                    totalPages: 3, // adjust based on data
                }}
            />

            <Modal
                modalKey="create"
                size="max-w-2xl"
                classNameTitle="font-medium text-xl"
                title={`Reys ${currentTrip?.id ? "tahrirlash" : "qo'shish"}`}
            >
                <div className="max-h-[80vh] overflow-y-auto p-0.5">
                    <AddTrip />
                </div>
            </Modal>

                        <DeleteModal path={TRIPS} id={currentTrip?.id} />

        </div>
    )
}

export default ShiftStatisticMain