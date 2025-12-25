import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import { VEHICLES } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import ReportsFilter from "../truck-details/filter"
import { useCostCols } from "./cols"
import AddTransport from "./create"

const FinanceStatisticMain = () => {
    const search: any = useSearch({ strict: false })
    const navigate = useNavigate()
    const params = useParams({ strict: false })
    const { getData, setData, clearKey } = useGlobalStore()
    const { openModal: openCreateModal, closeModal: closeCreateModal } =
        useModal("create")
    const { openModal: openDeleteModal } = useModal("delete")
    const currentTrip = getData<TripRow>(VEHICLES)

    const { data: vehiclesData, isLoading } = useGet<ListResponse<Truck>>(
        VEHICLES,
        {
            params: search,
        },
    )

    const handleCreate = () => {
        clearKey(VEHICLES)
        openCreateModal()
    }

    const handleEdit = (item: any) => {
        setData(VEHICLES, item)
        openCreateModal()
    }

    const handleDelete = (row: { original: any }) => {
        setData(VEHICLES, row.original)
        openDeleteModal()
    }
    const handleRowClick =(item:any)=>{
        const id = item?.id
        if (!id) return 

        navigate({
            to:"/truck-detail/$id",
            params:{id:id.toString()}
        })
    }

    const columns = useCostCols()
    return (
        <div className="space-y-3">
            <div className="flex sm:justify-end mb-3  gap-4">
                <Button onClick={handleCreate}>Transport qo'shish +</Button>
                <ReportsFilter />
            </div>

            <DataTable
                columns={columns}
                loading={isLoading}
                data={vehiclesData?.results}
                numeration
                onEdit={({ original }) => handleEdit(original)}
                onDelete={handleDelete}
                onRowClick={handleRowClick}
                head={
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-xl">{`Transportlar ro'yxati`}</h1>
                    </div>
                }
                paginationProps={{
                    totalPages: 2,
                }}
            />

            <Modal
                modalKey="create"
                size="max-w-2xl"
                classNameTitle="font-medium text-xl"
                title={`Transport ${currentTrip?.id ? "tahrirlash" : "qo'shish"}`}
            >
                <div className="max-h-[80vh] overflow-y-auto p-0.5">
                    <AddTransport />
                </div>
            </Modal>
            <DeleteModal path={VEHICLES} id={currentTrip?.id} />
        </div>
    )
}

export default FinanceStatisticMain
