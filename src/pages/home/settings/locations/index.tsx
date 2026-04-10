import DeleteModal from "@/components/custom/delete-modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_LOCATIONS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useNavigate, useSearch } from "@tanstack/react-router"
import ParamInput from "@/components/as-params/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useLocationColumns } from "./location-cols"
import type { LocationFeature, LocationList } from "./types"

const Locations = () => {
    const navigate = useNavigate()
    const search = useSearch({ strict: false })
    const columns = useLocationColumns()

    const { data, isLoading } = useGet<LocationList>(SETTINGS_LOCATIONS, {
        params: { search: (search as any).location_search },
    })

    const features = data?.features ?? []

    const { getData, setData } = useGlobalStore()
    const item = getData<LocationFeature>(SETTINGS_LOCATIONS)
    const { openModal: openDeleteModal } = useModal("delete")

    const handleEdit = (row: LocationFeature) => {
        navigate({
            to: "/locations/$id",
            params: { id: String(row.properties.id) },
        })
    }

    const handleDelete = (row: { original: LocationFeature }) => {
        setData(SETTINGS_LOCATIONS, row.original)
        openDeleteModal()
    }

    const handleCreate = () => {
        navigate({ to: "/locations/create" })
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={features}
                loading={isLoading}
                onEdit={({ original }) => handleEdit(original)}
                onDelete={handleDelete}
                onRowClick={handleEdit}
                numeration
                viewAll
                head={
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <ParamInput
                            fullWidth
                            searchKey="location_search"
                            pageKey="page"
                        />
                        <Button
                            className="flex items-center gap-2"
                            onClick={handleCreate}
                            icon={<PlusCircle size={18} />}
                        >
                            Qo'shish
                        </Button>
                    </div>
                }
            />
            <DeleteModal
                path={SETTINGS_LOCATIONS}
                refetchKeys={[SETTINGS_LOCATIONS]}
                id={item?.properties?.id}
            />
        </>
    )
}

export default Locations
