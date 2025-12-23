import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_DISTRICTS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import TableHeader from "@/pages/home/settings/table-header"
import { useGlobalStore } from "@/store/global-store"
import AddDestrictsModal from "./add-districts"
import { useColumnDestricts } from "./districts-cols"

const DistrictsTable = () => {
    const { data, isLoading } =
        useGet<ListResponse<SettingsDistrictType>>(SETTINGS_DISTRICTS)
    const { getData, setData } = useGlobalStore()
    const item = getData<SettingsDistrictType>(SETTINGS_DISTRICTS)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal("create")
    const columns = useColumnDestricts()

    const handleDelete = (row: { original: SettingsDistrictType }) => {
        setData(SETTINGS_DISTRICTS, row.original)
        openDeleteModal()
    }
    const handleEdit = (item: SettingsDistrictType) => {
        setData(SETTINGS_DISTRICTS, item)
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
                        fileName="Tumanlar"
                        url="excel"
                        storeKey={SETTINGS_DISTRICTS}
                    />
                }
            />
            <DeleteModal path={SETTINGS_DISTRICTS} id={item?.id} />
            <Modal
                size="max-w-2xl"
                title={`Tuman ${item?.id ? "tahrirlash" : "qo'shish"}`}
                modalKey={"create"}
            >
                <AddDestrictsModal />
            </Modal>
        </>
    )
}

export default DistrictsTable
