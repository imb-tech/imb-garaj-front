import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_FORWARDERS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import TableHeader from "../table-header"
import AddForwarderModal from "./add-forwarders"
import { useColumnsForwardersTable } from "./forwarders-col"

const forwardersData: ForwardersType[] = [
    {
        id: 1,
        full_name: "Jamshid Karshiboyev",
        phone_number: "+998901112233",
        passport_series: "AA1234567",
        jshshir: "12345678901234",
        warehouse: "Toshkent Markaziy Ombori",
    },
    {
        id: 2,
        full_name: "Farruh Mamatqulov",
        phone_number: "+998902224455",
        passport_series: "AB7654321",
        jshshir: "23456789012345",
        warehouse: "Chilonzor Ombori",
    },
    {
        id: 3,
        full_name: "Otabek Xolmatov",
        phone_number: "+998903336677",
        passport_series: "AC9876543",
        jshshir: "34567890123456",
        warehouse: "Sergeli Ombori",
    },
    {
        id: 4,
        full_name: "Botirjon Toxirov",
        phone_number: "+998904448899",
        passport_series: "AD1122334",
        jshshir: "45678901234567",
        warehouse: "Yangi Hayot Ombori",
    },
    {
        id: 5,
        full_name: "Behzod Qosimov",
        phone_number: "+998905559900",
        passport_series: "AE5566778",
        jshshir: "56789012345678",
        warehouse: "Olmazor Ombori",
    },
    {
        id: 6,
        full_name: "Javlon To‘xtasinov",
        phone_number: "+998906661122",
        passport_series: "AF9988776",
        jshshir: "67890123456789",
        warehouse: "Yashnobod Ombori",
    },
    {
        id: 7,
        full_name: "Sirojiddin Abduvaliyev",
        phone_number: "+998907773344",
        passport_series: "AG3344556",
        jshshir: "78901234567890",
        warehouse: "Qoyliq Ombori",
    },
    {
        id: 8,
        full_name: "Kamoliddin Sharipov",
        phone_number: "+998908885566",
        passport_series: "AH2233445",
        jshshir: "89012345678901",
        warehouse: "Parkent Ombori",
    },
    {
        id: 9,
        full_name: "Muslima Toshpo‘latova",
        phone_number: "+998909997755",
        passport_series: "AI6677889",
        jshshir: "90123456789012",
        warehouse: "Bektemir Ombori",
    },
    {
        id: 10,
        full_name: "Diyor Narzullayev",
        phone_number: "+998907001122",
        passport_series: "AJ4455667",
        jshshir: "01234567890123",
        warehouse: "Angren Logistika Ombori",
    },
]

const Forwarders = () => {
    const { data } = useGet<ForwardersType>(SETTINGS_FORWARDERS)
    const { getData, setData } = useGlobalStore()
    const item = getData<ForwardersType>(SETTINGS_FORWARDERS)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal(`create`)
    const columns = useColumnsForwardersTable()

    const handleDelete = (row: { original: ForwardersType }) => {
        setData(SETTINGS_FORWARDERS, row.original)
        openDeleteModal()
    }
    const handleEdit = (item: ForwardersType) => {
        setData(SETTINGS_FORWARDERS, item)
        openCreateModal()
    }
    return (
        <>
            <DataTable
                columns={columns}
                data={forwardersData}
                onDelete={handleDelete}
                onEdit={({ original }) => handleEdit(original)}
                numeration={true}
                head={
                    <TableHeader
                        fileName="Haydovchilar"
                        url="excel"
                        storeKey={SETTINGS_FORWARDERS}
                    />
                }
            />
            <DeleteModal path={SETTINGS_FORWARDERS} id={item?.id} />
            <Modal
                size="max-w-2xl"
                title={item?.id ? "Tahrirlash" : "Qo'shish"}
                modalKey="create"
            >
                <AddForwarderModal />
            </Modal>
        </>
    )
}

export default Forwarders
