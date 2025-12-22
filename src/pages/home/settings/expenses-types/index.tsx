import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_VEHICLE_TYPE } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import TableHeader from "../table-header"
import AddExpensesModal from "./add-expenses"
import { useColumnsExpensesTable } from "./expenses-cols"

const ExpensesTypePage = () => {
    // const search = useSearch({ from: "/_main/_settings/roles/" })
    const { data, isLoading } = useGet<ListResponse<VehicleRoleType>>(
        SETTINGS_VEHICLE_TYPE,
        // {
        //     params: search,
        // },
    )
    const { getData, setData } = useGlobalStore()
    const item = getData<VehicleRoleType>(SETTINGS_VEHICLE_TYPE)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal(`create`)
    const columns = useColumnsExpensesTable()

    const handleDelete = (row: { original: VehicleRoleType }) => {
        setData(SETTINGS_VEHICLE_TYPE, row.original)
        openDeleteModal()
    }
    const handleEdit = (item: VehicleRoleType) => {
        setData(SETTINGS_VEHICLE_TYPE, item)
        openCreateModal()
    }
    return (
        <>
            <DataTable
                loading={isLoading}
                columns={columns}
                data={data?.results}
                onDelete={handleDelete}
                onEdit={({ original }) => handleEdit(original)}
                numeration
                paginationProps={{
                    totalPages: data?.total_pages,
                }}
                head={
                    <TableHeader
                        fileName="Xarajatlar"
                        url="excel"
                        storeKey={SETTINGS_VEHICLE_TYPE}
                    />
                }
            />
            <DeleteModal path={SETTINGS_VEHICLE_TYPE} id={item?.id} />
            <Modal
                title={
                    item?.id ?
                        "Xarajat turinni tahrirlash"
                    :   " Xarajat qo'shish"
                }
                modalKey="create"
            >
                <AddExpensesModal />
            </Modal>
        </>
    )
}

export default ExpensesTypePage
