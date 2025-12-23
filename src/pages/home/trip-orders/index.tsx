import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import Modal from "@/components/custom/modal"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useMatch, useNavigate, useSearch } from "@tanstack/react-router"
import { formatMoney } from "@/lib/format-money"
import { useCostCols } from "./cols"
import DeleteModal from "@/components/custom/delete-modal"
import { TRIPS, TRIPS_ORDERS } from "@/constants/api-endpoints"
import AddTripOrders from "./create"



const TripOrderMain = () => {
  const navigate = useNavigate()
  const { getData, setData, clearKey } = useGlobalStore()
  const { openModal: openCreateModal, closeModal: closeCreateModal } = useModal("create")
  const { openModal: openDeleteModal } = useModal("delete")
  const currentTripsOrder = getData<TripsOrders>(TRIPS_ORDERS)

  const search = useSearch({ strict:false },)
  const tripId = search?.id

  const { data, isLoading } = useGet<ListResponse<TripOrdersRow>>(TRIPS_ORDERS, {
    params: {
      trip: tripId,
    },
  })



  const columns = useCostCols()

  const handleCreate = () => {
    clearKey(TRIPS_ORDERS)
    openCreateModal()
  }

  const handleEdit = (item: TripOrdersRow) => {
    setData(TRIPS_ORDERS, item)
    openCreateModal()
  }

  const handleDelete = (row: { original: TripOrdersRow }) => {
    setData(TRIPS_ORDERS, row.original)
    openDeleteModal()
  }

  const handleRowClick = (item: TripOrdersRow) => {
    const id = item?.id
    if (!id) return
    navigate({
      to: "/trip-orders/$id",
      params: { id: id.toString() },
    })
  }



  return (
    <div className="space-y-3">
      <div className="flex sm:justify-end mb-3">
        <Button onClick={handleCreate}>
          Buyurtma qo'shish +
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
        head={
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-xl">Buyurtmalar ro'yxati</h1>
            <Badge className="text-sm">{formatMoney(25)}</Badge>
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
        title={`Buyurtma ${currentTripsOrder?.id ? "tahrirlash" : "qo'shish"}`}
      >
        <div className="max-h-[80vh] overflow-y-auto p-0.5">
          <AddTripOrders />
        </div>
      </Modal>

      <DeleteModal path={TRIPS_ORDERS} id={currentTripsOrder?.id} />

    </div>
  )
}

export default TripOrderMain