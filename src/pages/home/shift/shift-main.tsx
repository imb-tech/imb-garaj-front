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

const ShiftStatisticMain = () => {
    const navigate = useNavigate()
    const { getData, setData, clearKey } = useGlobalStore()
    const { openModal: openCreateModal, closeModal: closeCreateModal } = useModal("create")
    const { openModal: openDeleteModal } = useModal("delete")

    const currentShift = getData<any>(SHIFTS) // Adjust type if you have ShiftType

    // Example static data (replace with real API later)
    const { data: shiftData, isLoading } = useGet<any>(SHIFTS, {
        // params: search if needed
    })

    // Or use static for now
    const data = [
        {
            id: 4731,
            vehicle_number: "01 369 JKA",
            transport_type: "Fura",
            driver: "Abdulla Qodirov",
            shift_count: 4,
            distance_km: 170,
            fuel_per_100km: 25,
            mileage_km: 170000,
            income: 1500000,
            expenses: 1200000,
            profit: 100000,
            start_date: "2024-11-01",
            shift_type: "Ichki",
        },
        // ... more
    ]

    const allData = Array.from({ length: 26 }, (_, i) => ({
        ...data[i % data.length],
        id: 4731 + i, // make unique ids
    }))

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
                data={allData}
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