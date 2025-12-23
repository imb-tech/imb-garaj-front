import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_REGIONS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import TableHeader from "@/pages/home/settings/table-header"
import { useGlobalStore } from "@/store/global-store"
import { useMatch, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import AddRegionsModal from "./add-regions"
import { useColumnsRegionsTable } from "./regions-cols"

const RegionsTable = ({ country_id }: { country_id: number }) => {
    const navigate = useNavigate()
    const match = useMatch({
        from: "/_main/_settings/locations/",
        shouldThrow: false,
    })

    const { data, isLoading } = useGet<ListResponse<RegionsType>>(
        `${SETTINGS_REGIONS}`,
        {
            params: {
                country: country_id,
            },
        },
    )
    const { getData, setData } = useGlobalStore()
    const item = getData<RegionsType>(SETTINGS_REGIONS)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal("create")
    const columns = useColumnsRegionsTable()

    const handleDelete = (row: { original: RegionsType }) => {
        setData(SETTINGS_REGIONS, row.original)
        openDeleteModal()
    }
    const handleEdit = (item: RegionsType) => {
        setData(SETTINGS_REGIONS, item)
        openCreateModal()
    }

    useEffect(() => {
        if (data?.results?.length) {
            navigate({
                to: "/locations",
                search: {
                    ...match?.search,
                },
            })
        }
    }, [data, navigate, country_id, match?.search])

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
                        fileName="Viloyatlar"
                        url="excel"
                        storeKey={SETTINGS_REGIONS}
                    />
                }
            />
            <DeleteModal path={SETTINGS_REGIONS} id={item?.id} />
            <Modal
                size="max-w-2xl"
                title={`Viloyat ${item?.id ? "tahrirlash" : "qo'shish"}`}
                modalKey={"create"}
            >
                <AddRegionsModal />
            </Modal>
        </>
    )
}

export default RegionsTable
