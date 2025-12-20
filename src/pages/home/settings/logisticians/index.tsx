import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import {
    SETTINGS_LOGISTICIANS,
    SETTINGS_LOGISTICIANS_UPDATE,
} from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useSearch } from "@tanstack/react-router"
import TableHeader from "../table-header"
import AddLogisticansModal from "./add-logisticians"
import { useColumnsLogisticiansTable } from "./logisticians-cols"

const Logisticians = () => {
    const search = useSearch({ from: "/_main/settings/logisticians" })
    const { data, isLoading } = useGet<ListResponse<LogisticiansType>>(
        SETTINGS_LOGISTICIANS,
        {
            params: search,
        },
    )
    const { getData, setData } = useGlobalStore()
    const item = getData<LogisticiansType>(SETTINGS_LOGISTICIANS)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal(`create`)
    const columns = useColumnsLogisticiansTable()

    const handleDelete = (row: { original: LogisticiansType }) => {
        setData(SETTINGS_LOGISTICIANS, row.original)
        openDeleteModal()
    }
    const handleEdit = (item: LogisticiansType) => {
        setData(SETTINGS_LOGISTICIANS, item)
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
                        fileName="Logistlar"
                        url="excel"
                        storeKey={SETTINGS_LOGISTICIANS}
                    />
                }
            />
            <DeleteModal path={SETTINGS_LOGISTICIANS_UPDATE} id={item?.uuid} />
            <Modal
                size="max-w-2xl"
                title={item?.uuid ? "Logist tahrirlash" : "Logist qo'shish"}
                modalKey="create"
            >
                <AddLogisticansModal />
            </Modal>
        </>
    )
}

export default Logisticians
