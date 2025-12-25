import ParamPagination from "@/components/as-params/pagination"
import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { TRIPS_ORDERS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { format } from "date-fns"
import { ChevronDown, MoreVertical, Pencil, Trash2 } from "lucide-react"
import OrderTabs from "./cashfow"
import AddTripOrders from "./create"

const TripOrderMain = () => {
    const { id } = useParams({ strict: false })
    const search = useSearch({ strict: false })
    const navigate = useNavigate()

    const page = Number(search.page ?? 1)
    const expandedOrderId = search.order ? Number(search.order) : null

    const { getData, setData, clearKey } = useGlobalStore()
    const { openModal: openCreateModal } = useModal("create")
    const { openModal: openDeleteModal } = useModal("delete")

    const currentTripsOrder = getData<TripsOrders>(TRIPS_ORDERS)

    const { data, isLoading } = useGet<ListResponse<TripOrdersRow>>(
        TRIPS_ORDERS,
        {
            params: {
                id,
                page,
            },
        },
    )

    const toggleExpand = (orderId: number) => {
        const isOpen = expandedOrderId === orderId

        navigate({
            search: ((prev: Record<string, unknown>) => ({
                ...prev,
                order: isOpen ? undefined : String(orderId),
            })) as any,
        })
    }

    const handleCreate = () => {
        clearKey(TRIPS_ORDERS)
        openCreateModal()
    }

    const handleEdit = (order: TripOrdersRow, e: React.MouseEvent) => {
        e.stopPropagation()
        setData(TRIPS_ORDERS, order)
        openCreateModal()
    }

    const handleDelete = (order: TripOrdersRow, e: React.MouseEvent) => {
        e.stopPropagation()
        setData(TRIPS_ORDERS, order)
        openDeleteModal()
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-end">
                <Button onClick={handleCreate}>Buyurtma qo‘shish +</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Yuklash joyi</TableHead>
                        <TableHead>Tushirish joyi</TableHead>
                        <TableHead>Yuk turi</TableHead>
                        <TableHead>To‘lov miqdori</TableHead>
                        <TableHead>Valyuta</TableHead>
                        <TableHead>Yaratilgan sana</TableHead>
                        <TableHead />
                        <TableHead />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center py-6">
                                Yuklanmoqda...
                            </TableCell>
                        </TableRow>
                    )}

                    {data?.results?.map((order, index) => {
                        const isExpanded = expandedOrderId === order.id

                        return (
                            <>
                                <TableRow
                                    key={order.id}
                                    className={`cursor-pointer ${
                                        isExpanded ? "bg-secondary" : ""
                                    }`}
                                    onClick={() => toggleExpand(order.id)}
                                >
                                    <TableCell>
                                        {(page - 1) * (data.page_size ?? 2) +
                                            index +
                                            1}
                                    </TableCell>

                                    <TableCell>{order.loading_name}</TableCell>
                                    <TableCell>
                                        {order.unloading_name}
                                    </TableCell>

                                    <TableCell>
                                        {order.cargo_type_name ?? "—"}
                                    </TableCell>

                                    <TableCell>
                                        {order.payments?.[0]?.amount ?
                                            Number(
                                                order.payments[0].amount,
                                            ).toLocaleString("uz-UZ")
                                        :   "—"}
                                    </TableCell>

                                    <TableCell>
                                        {order.payments?.[0]?.currency === 1 ?
                                            "UZS"
                                        : order.payments?.[0]?.currency === 2 ?
                                            "USD"
                                        :   "—"}
                                    </TableCell>

                                    <TableCell>
                                        {order.created ?
                                            format(
                                                new Date(order.created),
                                                "dd.MM.yyyy HH:mm",
                                            )
                                        :   "—"}
                                    </TableCell>

                                    <TableCell className="text-right p-0">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={(e) =>
                                                        handleEdit(order, e)
                                                    }
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Tahrirlash
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={(e) =>
                                                        handleDelete(order, e)
                                                    }
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    O‘chirish
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>

                                    <TableCell className="text-right p-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                toggleExpand(order.id)
                                            }}
                                        >
                                            <ChevronDown
                                                className={`transition-transform ${
                                                    isExpanded ? "rotate-180"
                                                    :   ""
                                                }`}
                                            />
                                        </Button>
                                    </TableCell>
                                </TableRow>

                                {isExpanded && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="p-0">
                                            <OrderTabs />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )
                    })}
                </TableBody>
            </Table>

            {!!data?.total_pages && data.total_pages > 1 && (
                <div className="pt-4 flex justify-center">
                    <ParamPagination
                        totalPages={data.total_pages}
                        disabled={isLoading}
                    />
                </div>
            )}

            <Modal
                modalKey="create"
                size="max-w-2xl"
                title={`Buyurtma ${
                    currentTripsOrder?.id ? "tahrirlash" : "qo‘shish"
                }`}
            >
                <AddTripOrders />
            </Modal>

            <DeleteModal path={TRIPS_ORDERS} id={currentTripsOrder?.id} />
        </div>
    )
}

export default TripOrderMain
