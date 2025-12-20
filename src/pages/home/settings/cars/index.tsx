import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_CARS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useSearch } from "@tanstack/react-router"
import TableHeader from "../table-header"
import AddCarsModal from "./add-cars"
import { useColumnsCarsTable } from "./cars-cols"

const Cars = () => {
    const search = useSearch({ from: "/_main/settings/cars" })

    const { data, isLoading } = useGet<ListResponse<CarsType>>(SETTINGS_CARS, {
        params: search,
    })
    const { getData, setData } = useGlobalStore()
    const item = getData<ProductsType>(SETTINGS_CARS)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal("create")
    const columns = useColumnsCarsTable()

    const handleDelete = (row: { original: CarsType }) => {
        setData(SETTINGS_CARS, row.original)
        openDeleteModal()
    }
    const handleEdit = (item: CarsType) => {
        setData(SETTINGS_CARS, item)
        openCreateModal()
    }

    return (
        <>
            <DataTable
                loading={isLoading}
                columns={columns}
                data={data?.results}
                numeration={true}
                onDelete={handleDelete}
                paginationProps={{
                    totalPages: data?.total_pages,
                }}
                onEdit={({ original }) => handleEdit(original)}
                head={
                    <TableHeader
                        fileName="Avtomobillar"
                        url="excel"
                        storeKey={SETTINGS_CARS}
                    />
                }
            />
            <DeleteModal path={SETTINGS_CARS} id={item?.uuid} />
            <Modal
                size="max-w-2xl"
                title={`Avtomobil ${item?.uuid ? "tahrirlash" : "qo'shish"}`}
                modalKey="create"
            >
                <AddCarsModal />
            </Modal>
        </>
    )
}

export default Cars
