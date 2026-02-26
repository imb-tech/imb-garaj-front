import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import { SETTINGS_ROLES } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useSearch } from "@tanstack/react-router"
import { useCostCols } from "./cols"



export const fakeCostData:any[] = [
  {
    created: "2024-01-15T09:30:00",
    amount: "1500000",
    technic: 3,
    end_time: "2024-02-15T18:00:00",
  },
  {
    created: "2024-02-03T11:45:00",
    amount: "750000",
    technic: 1,
    end_time: "2024-03-01T17:00:00",
  },
  {
    created: "2024-02-20T08:00:00",
    amount: "3200000",
    technic: 7,
    end_time: "2024-04-20T12:00:00",
  },
  {
    created: "2024-03-05T14:15:00",
    amount: "",
    technic: 2,
    end_time: "",
  },
  {
    created: "2024-03-18T16:30:00",
    amount: "980000",
    technic: 5,
    end_time: "2024-05-18T09:00:00",
  },
  {
    created: "",
    amount: "450000",
    technic: 4,
    end_time: "2024-06-01T15:30:00",
  },
  {
    created: "2024-04-10T10:00:00",
    amount: "12750000",
    technic: 10,
    end_time: "2024-07-10T18:00:00",
  },
]
const TruckCheck = () => {
    const search = useSearch({ strict: false })
    const { data, isLoading } = useGet<CashflowRow>(
        SETTINGS_ROLES,
        {
            params: {
                search: search.roles_search,
                page: search.page,
                page_size: search.page_size,
            },
        },
    )
    const { getData, setData } = useGlobalStore()
    const item = getData<RolesType>(SETTINGS_ROLES)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal(`create`)
    const columns = useCostCols()

    const handleDelete = (row: { original:CashflowRow }) => {
        setData(SETTINGS_ROLES, row.original)
        openDeleteModal()
    }
    // const handleEdit = (item: RolesType) => {
    //     setData(SETTINGS_ROLES, item)
    //     openCreateModal()
    // }
    return (
        <>
            <DataTable
                loading={isLoading}
                columns={columns || []}
                data={fakeCostData}
                // onDelete={handleDelete}
                // onEdit={({ original }) => handleEdit(original)}
                numeration
                paginationProps={{
                    totalPages: data?.total_pages,
                    paramName: "page",
                    pageSizeParamName: "page_size",
                }}
                // head={
                //     <TableHeader
                //         fileName="Rollar"
                //         url="excel"
                //         storeKey={SETTINGS_ROLES}
                //         searchKey="roles_search"
                //         pageKey="page"
                //     />
                // }
            />
            <DeleteModal path={SETTINGS_ROLES} id={item?.id} />
        
        </>
    )
}

export default TruckCheck



