import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_CARGO_TYPE } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useColumnsCargoTable } from "."
import TableHeader from "../table-header"
import AddCargoModal from "./add-cargo"

const  CargoPage = () => {
    // const search = useSearch({ from: "/_main/_settings/roles/" })
    const { data, isLoading } = useGet<ListResponse<RolesType>>(
        SETTINGS_CARGO_TYPE,
        // {
        //     params: search,
        // },
    )
    const { getData, setData } = useGlobalStore()
    const item = getData<RolesType>(SETTINGS_CARGO_TYPE)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal(`create`)
    const columns = useColumnsCargoTable()

    const handleDelete = (row: { original: RolesType }) => {
        setData(SETTINGS_CARGO_TYPE, row.original)
        openDeleteModal()
    }
    const handleEdit = (item: RolesType) => {
        setData(SETTINGS_CARGO_TYPE, item)
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
                        fileName="Yuk"
                        url="excel"
                        storeKey={SETTINGS_CARGO_TYPE}
                    />
                }
            />
            <DeleteModal path={SETTINGS_CARGO_TYPE} id={item?.id} />
            <Modal
                title={
                    item?.id ? "Yuk turini tahrirlash" : " Yuk turini  qo'shish"
                }
                modalKey="create"
            >
                <AddCargoModal />
            </Modal>
        </>
    )
}

export default  CargoPage
