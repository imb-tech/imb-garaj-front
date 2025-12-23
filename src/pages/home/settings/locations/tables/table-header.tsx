import ParamInput from "@/components/as-params/input"
import DownloadAsExcel from "@/components/download-as-excel"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { CirclePlus } from "lucide-react"

interface TableHeaderProps {
    fileName: string
    storeKey?: string
    url: string
    modalKey:string
}

const TableHeaderLocation = ({ fileName, storeKey,modalKey }: TableHeaderProps) => {
    const { openModal: openCreateModal } = useModal(modalKey)
    const { clearKey } = useGlobalStore()

    const handleAdd = () => {
        if (storeKey) {
            clearKey(storeKey)
        }
        openCreateModal()
    }

    return (
        <div className="flex items-center justify-between gap-3 mb-3">
            <ParamInput fullWidth />
            <div className="flex items-center gap-3">
                <DownloadAsExcel url={"settings_url"} name={`${fileName}`} />

                <Button
                    className="text-white bg-primary hover:bg-primary/90"
                    onClick={handleAdd}
                    icon={<CirclePlus size={18} />}
                >
                    Qo'shish
                </Button>
            </div>
        </div>
    )
}

export default TableHeaderLocation
