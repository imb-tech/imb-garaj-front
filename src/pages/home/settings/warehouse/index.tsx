import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_WAREHOUSE } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useSearch } from "@tanstack/react-router"
import TableHeader from "../table-header"
import AddWarehouse from "./add-warehouse"
import { useColumnsWarehouseTable } from "./warehouse-cols"

const Warehouse = () => {
    const search = useSearch({ from: "/_main/settings/warehouse" })
    const { data, isLoading } = useGet<ListResponse<WarehouseType>>(
        SETTINGS_WAREHOUSE,
        {
            params: search,
        },
    )
    const { getData, setData } = useGlobalStore()
    const item = getData<WarehouseType>(SETTINGS_WAREHOUSE)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal("create")
    const columns = useColumnsWarehouseTable()

    const handleDelete = (row: { original: WarehouseType }) => {
        setData(SETTINGS_WAREHOUSE, row.original)
        openDeleteModal()
    }
    const handleEdit = (item: WarehouseType) => {
        setData(SETTINGS_WAREHOUSE, item)
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
                numeration={true}
                head={
                    <TableHeader
                        fileName="Ombor"
                        url="excel"
                        storeKey={SETTINGS_WAREHOUSE}
                    />
                }
            />
            <DeleteModal path={SETTINGS_WAREHOUSE} id={item?.uuid} />
            <Modal
                size="max-w-xl"
                title={`Ombor ${item?.uuid ? "tahrirlash" : "qo'shish"}`}
                modalKey="create"
            >
                <AddWarehouse />
            </Modal>
        </>
    )
}

export default Warehouse
