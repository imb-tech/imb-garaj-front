import { DataTable } from "@/components/ui/datatable"
import { useNavigate } from "@tanstack/react-router"
import { useLocationColumns } from "./location-cols"
import { MOCK_LOCATIONS } from "./mock-data"
import type { LocationItem } from "./types"
import ParamInput from "@/components/as-params/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

const Locations = () => {
    const navigate = useNavigate()
    const columns = useLocationColumns()

    const handleEdit = (row: LocationItem) => {
        navigate({ to: "/locations/$id", params: { id: String(row.id) } })
    }

    const handleCreate = () => {
        navigate({ to: "/locations/create" })
    }

    return (
        <DataTable
            columns={columns}
            data={MOCK_LOCATIONS}
            onEdit={({ original }) => handleEdit(original)}
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
    )
}

export default Locations
