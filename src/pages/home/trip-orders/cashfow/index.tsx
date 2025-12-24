import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import Modal from "@/components/custom/modal"
import DeleteModal from "@/components/custom/delete-modal"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { formatMoney } from "@/lib/format-money"
import { ORDER_CASHFLOWS } from "@/constants/api-endpoints"
import { useCostCols } from "./cols"
import AddCashflow from "./add-cashflow"

interface TripOrderDetailRowProps {
  orderId: number
}

const TripOrderDetailRow = ({ orderId }: TripOrderDetailRowProps) => {
  const { getData, setData, clearKey } = useGlobalStore()
  const { openModal: openCreateModal } = useModal("create")
  const { openModal: openDeleteModal } = useModal("delete")

  const currentCashflow = getData<CashflowRow>(ORDER_CASHFLOWS)

  const { data, isLoading } = useGet<ListResponse<CashflowRow>>(
    ORDER_CASHFLOWS,
    {
      params: { order: orderId },
      
    }
  )

  const columns = useCostCols()

  const handleCreate = () => {
    clearKey(ORDER_CASHFLOWS)
    openCreateModal()
  }

  const handleEdit = (item: CashflowRow) => {
    setData(ORDER_CASHFLOWS, item)
    openCreateModal()
  }

  const handleDelete = (row: { original: CashflowRow }) => {
    setData(ORDER_CASHFLOWS, row.original)
    openDeleteModal()
  }

  return (
    <div className="space-y-3 border-t p-4">
      {/* CREATE */}
      <div className="flex justify-end">
        <Button size="sm" onClick={handleCreate}>
          Cashflow qo‘shish +
        </Button>
      </div>

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-medium">Cashflow</h3>
        <Badge className="text-sm">
          {formatMoney(
            data?.results?.reduce(
              (sum, item) => sum + Number(item.amount ?? 0),
              0
            ) || 0
          )}
        </Badge>
      </div>

      {/* TABLE */}
      <DataTable
        loading={isLoading}
        columns={columns}
        data={data?.results}
        numeration
        onEdit={({ original }) => handleEdit(original)}
        onDelete={handleDelete}
        paginationProps={{
          totalPages: data?.total_pages ?? 1,
        }}
      />

      {/* MODAL */}
      <Modal
        modalKey="create"
        size="max-w-2xl"
        classNameTitle="font-medium text-xl"
        title={`Cashflow ${
          currentCashflow?.id ? "tahrirlash" : "qo‘shish"
        }`}
      >
        <div className="max-h-[80vh] overflow-y-auto p-0.5">
          <AddCashflow />
        </div>
      </Modal>

      {/* DELETE */}
      <DeleteModal
        path={ORDER_CASHFLOWS}
        id={currentCashflow?.id}
      />
    </div>
  )
}

export default TripOrderDetailRow
