import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_PRODUCTS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useSearch } from "@tanstack/react-router"
import TableHeader from "../table-header"
import AddProductModal from "./add-modal"
import { useoColumns } from "./cols"

const Products = () => {
    const { getData, setData, clearKey } = useGlobalStore()
    const item = getData<ProductsType>(SETTINGS_PRODUCTS)
    const search = useSearch({ from: "/_main/settings/products" })

    const { data, isLoading } = useGet<ListResponse<ProductsType>>(
        SETTINGS_PRODUCTS,
        {
            params: search,
        },
    )

    const { openModal: openDeleteModal } = useModal()
    const { openModal: openCreateModal } = useModal(`create`)
    const handleDelete = (row: { original: ProductsType }) => {
        setData(SETTINGS_PRODUCTS, row.original)
        openDeleteModal()
    }

    const handleEdit = (item: ProductsType) => {
        setData(SETTINGS_PRODUCTS, item)
        openCreateModal()
    }
    const columns = useoColumns()

    return (
        <div>
            <DataTable
                loading={isLoading}
                data={data?.results}
                columns={columns}
                onDelete={handleDelete}
                onEdit={({ original }) => handleEdit(original)}
                paginationProps={{
                    totalPages: data?.total_pages,
                }}
                head={
                    <TableHeader
                        fileName="Mahsulotlar"
                        url="excel"
                        storeKey={SETTINGS_PRODUCTS}
                    />
                }
            />
            <Modal
                size="max-w-2xl"
                title={`Mahsulot ${item?.uuid ? "tahrirlash" : "qo'shish"}`}
                modalKey="create"
            >
                <AddProductModal />
            </Modal>
            <DeleteModal path={SETTINGS_PRODUCTS} id={item?.uuid} />
        </div>
    )
}

export default Products