import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import Modal from "@/components/custom/modal"
import { SHIFTS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useNavigate } from "@tanstack/react-router"
import { formatMoney } from "@/lib/format-money"
import { useCostCols } from "./cols"

import AddShift from "./create"
import DeleteModal from "@/components/custom/delete-modal"

type CardMain = {
    current_balance: number
    current_balance_perc: number
    difference: number
    difference_perc: number
    expenses: number
    expense_perc: number
    incomes: number
    income_perc: number
}

type ShiftRow = {
  id: number|string;
  created: string; // ISO datetime string
  updated: string; // ISO datetime string
  status: number;
  type: number;
  start: string; // YYYY-MM-DD date string
  end: string | null; // YYYY-MM-DD or null if ongoing
  driver: number; // driver ID
  vehicle: number; // vehicle ID
}

const ShiftStatisticMain = () => {
    const navigate = useNavigate()
    const { getData, setData, clearKey } = useGlobalStore()
    const { openModal: openCreateModal, closeModal: closeCreateModal } = useModal("create")
    const { openModal: openDeleteModal } = useModal("delete")

    const currentShift = getData<ShiftRow>(SHIFTS) 


    const { data, isLoading } = useGet<ListResponse<ShiftRow>>(SHIFTS)


    const columns = useCostCols()

    const handleCreate = () => {
        clearKey(SHIFTS)
        openCreateModal()
    }

    const handleEdit = (item: any) => {
        setData(SHIFTS, item)
        openCreateModal()
    }

       const handleDelete = (row: { original:any}) => {
        setData(SHIFTS, row.original)
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
                // onRowClick={(row) =>
                //     navigate({ to: "/shift-detail/$id", params: { id: row.original.id.toString() } })
                // }
                head={
                    <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-xl">Transportlar ro'yxati</h1>
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
                title={`Reys ${currentShift?.id ? "tahrirlash" : "qo'shish"}`}
            >
                <div className="max-h-[80vh] overflow-y-auto p-0.5">
                    <AddShift />
                </div>
            </Modal>

                        <DeleteModal path={SHIFTS} id={currentShift?.id} />

        </div>
    )
}

export default ShiftStatisticMain