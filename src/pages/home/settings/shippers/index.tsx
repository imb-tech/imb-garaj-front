import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_SHIPPERS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useSearch } from "@tanstack/react-router"
import TableHeader from "../table-header"
import AddShippersModal from "./add-shippers"
import { useColumnsShippersTable } from "./shippers-cols"

const Shippers = () => {
    const search = useSearch({ from: "/_main/settings/shippers" })
    const { data, isLoading } = useGet<ListResponse<ShippersType>>(
        SETTINGS_SHIPPERS,
        {
            params: search,
        },
    )
    const { getData, setData } = useGlobalStore()
    const item = getData<ShippersType>(SETTINGS_SHIPPERS)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal(`create`)
    const columns = useColumnsShippersTable()

    const handleDelete = (row: { original: ShippersType }) => {
        setData(SETTINGS_SHIPPERS, row.original)
        openDeleteModal()
    }
    const handleEdit = (item: ShippersType) => {
        setData(SETTINGS_SHIPPERS, item)
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
                        fileName="Yetkazib beruvchilar"
                        url="excel"
                        storeKey={SETTINGS_SHIPPERS}
                    />
                }
            />
            <DeleteModal path={SETTINGS_SHIPPERS} id={item?.id} />
            <Modal
                title={
                    item?.id ?
                        "Yetkazib beruvchilarni tahrirlash"
                    :   " Yetkazib beruvchilarni qo'shish"
                }
                modalKey="create"
            >
                <AddShippersModal />
            </Modal>
        </>
    )
}

export default Shippers
