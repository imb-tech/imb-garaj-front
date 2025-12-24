import Modal from "@/components/custom/modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SETTINGS_COUNTRIES } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import CountriesTable from "./tables/country"
import AddCountriesModal from "./tables/country/add-country"

const Locations = () => {
    const { openModal } = useModal("country-modal")
    const {clearKey } = useGlobalStore()

    const handleCountyModalOpen = () => {
        clearKey(SETTINGS_COUNTRIES)
        openModal()
    }

    return (
        <>
            <Card className="h-full w-full flex flex-col">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-xl font-semibold tracking-tight">
                            Davlatlar
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 min-h-0 pt-0">
                    <div className="h-full rounded-md overflow-hidden">
                        <div className="h-full overflow-auto">
                            <CountriesTable
                                onAddClick={handleCountyModalOpen}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Modal
                size="max-w-2xl"
                title="Davlat qo'shish"
                modalKey="country-modal"
            >
                <AddCountriesModal />
            </Modal>
        </>
    )
}

export default Locations
