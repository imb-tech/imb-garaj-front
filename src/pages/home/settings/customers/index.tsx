import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_CUSTOMERS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useSearch } from "@tanstack/react-router"
import TableHeader from "../table-header"
import AddCustomersModal from "./add-customers"
import { useColumnsCustomersTable } from "./customers-cols"

const Customers = () => {
    const search = useSearch({ from: "/_main/settings/customers" })
    const { data, isLoading } = useGet<ListResponse<CustomersType>>(
        SETTINGS_CUSTOMERS,
        {
            params: search,
        },
    )
    const { getData, setData } = useGlobalStore()
    const item = getData<CustomersType>(SETTINGS_CUSTOMERS)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal("create")
    const columns = useColumnsCustomersTable()

    const handleDelete = (row: { original: CustomersType }) => {
        setData(SETTINGS_CUSTOMERS, row.original)
        openDeleteModal()
    }
    const handleEdit = (item: CustomersType) => {
        setData(SETTINGS_CUSTOMERS, item)
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
                        fileName="Mijozlar"
                        url="excel"
                        storeKey={SETTINGS_CUSTOMERS}
                    />
                }
            />
            <DeleteModal path={SETTINGS_CUSTOMERS} id={item?.uuid} />
            <Modal
                size="max-w-4xl"
                title={`Mijoz ${item?.uuid ? "tahrirlash" : "qo'shish"}`}
                modalKey={"create"}
            >
                <AddCustomersModal />
            </Modal>
        </>
    )
}

export default Customers
