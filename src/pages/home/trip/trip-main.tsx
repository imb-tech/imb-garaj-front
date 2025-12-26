import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import { TRIPS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useNavigate } from "@tanstack/react-router"
import { useCostCols } from "./cols"
import AddTrip from "./create"
import ParamInput from "@/components/as-params/input"
import { CirclePlus, PlusCircle } from "lucide-react"

const ShiftStatisticMain = () => {
    const navigate = useNavigate()
    const { getData, setData, clearKey } = useGlobalStore()
    const { openModal: openCreateModal } = useModal("create")
    const { openModal: openDeleteModal } = useModal("delete")

    const currentTrip = getData<TripRow>(TRIPS)

    const { data, isLoading } = useGet<ListResponse<TripRow>>(TRIPS)

    const columns = useCostCols()

    const handleCreate = () => {
        clearKey(TRIPS)
        openCreateModal()
    }

    const handleEdit = (item: TripRow) => {
        setData(TRIPS, item)
        openCreateModal()
    }

    const handleDelete = (row: { original: any }) => {
        setData(TRIPS, row.original)
        openDeleteModal()
    }

    const handleRowClick = (item: TripRow) => {
        const id = item?.id
        if (!id) return

        navigate({
            to: "/trip-orders/$id",
            params: { id: id.toString() },
        })
    }



    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-3 gap-4">
                <ParamInput name="driver_name" fullWidth searchKey="driver_name"/>
                
                <Button className="flex items-center gap-2" onClick={handleCreate}>
                    <CirclePlus size={18}/>
                    Qo'shish
                </Button>
            </div>

            <DataTable
                loading={isLoading}
                columns={columns}
                data={data?.results}
                numeration
                onEdit={({ original }) => handleEdit(original)}
                onDelete={handleDelete}
                onRowClick={handleRowClick}
                // onView={(row) => {
                //     navigate({
                //         to: "/trip-orders/$id",
                //         params: {
                //             id: String(row.original.id),
                //         },
                //     })
                // }}
                head={
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-xl">Reyslar ro'yxati</h1>
                    </div>
                }
                paginationProps={{
                    totalPages: 3,
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
