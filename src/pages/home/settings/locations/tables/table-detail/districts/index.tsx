import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_DISTRICTS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useSearch } from "@tanstack/react-router"
import TableHeaderLocation from "../../table-header"
import AddDestrictsModal from "./add-districts"
import { useColumnDestricts } from "./districts-cols"

interface DistrictsTableProps {
    country_id: number
    region_id?: string | number
}

const DistrictsTable = ({ country_id, region_id }: DistrictsTableProps) => {
    const search = useSearch({ strict: false })
    const { data, isLoading } = useGet<ListResponse<SettingsDistrictType>>(
        SETTINGS_DISTRICTS,
        {
            params: {
                region: region_id ? { region: region_id } : undefined,
                search: search.district_search,
            },

            enabled: !!region_id,
        },
    )

    const { getData, setData } = useGlobalStore()
    const item = getData<SettingsDistrictType>(SETTINGS_DISTRICTS)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal("create-districts")
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
                data={region_id ? data?.results : []}
                onDelete={handleDelete}
                onEdit={({ original }) => handleEdit(original)}
                numeration={true}
                head={
                    <TableHeaderLocation
                        storeKey={SETTINGS_DISTRICTS}
                        modalKey="create-districts"
                        disabled={!region_id}
                        pageKey="page"
                        name="tumanlar"
                        searchKey="district_search"
                    />
                }
            />
            <DeleteModal path={SETTINGS_DISTRICTS} id={item?.id} />
            <Modal
                size="max-w-2xl"
                title={`Tuman ${item?.id ? "tahrirlash" : "qo'shish"}`}
                modalKey={"create-districts"}
            >
                <AddDestrictsModal
                    region_id={region_id}
                    country_id={country_id}
                />
            </Modal>
        </>
    )
}

export default DistrictsTable
