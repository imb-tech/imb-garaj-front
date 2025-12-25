import * as React from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Modal from "@/components/custom/modal"
import DeleteModal from "@/components/custom/delete-modal"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { TRIPS_ORDERS } from "@/constants/api-endpoints"
import AddTripOrders from "./create"
import { MoreVertical, Pencil, Trash2, ChevronDown } from "lucide-react"
import OrderTabs from "./cashfow"
import ParamPagination from "@/components/as-params/pagination"
import { cn } from "@/lib/utils"

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
    }
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

      <div className="flex items-center gap-3">
        <h1 className="text-xl">Buyurtmalar ro‘yxati</h1>
      </div>

      {/* TABLE WRAPPER (same as DataTable) */}
      <div className="bg-card rounded-md p-3">
        <Table className="select-text bg-card rounded-md">
          <TableHeader>
            <TableRow className="border-none">
              <TableHead>#</TableHead>
              <TableHead>Yuklash joyi</TableHead>
              <TableHead>Tushirish joyi</TableHead>
              <TableHead>Yuk turi</TableHead>
              <TableHead>To‘lov miqdori</TableHead>
              <TableHead>Valyuta</TableHead>
              <TableHead>Yaratilgan sana</TableHead>
              <TableHead className="text-right" />
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow className="border-none">
                <TableCell colSpan={9} className="text-center py-6">
                  Yuklanmoqda...
                </TableCell>
              </TableRow>
            )}

            {data?.results?.map((order, index) => {
              const isExpanded = expandedOrderId === order.id

              return (
                <React.Fragment key={order.id}>
                  <TableRow
                    onClick={() => toggleExpand(order.id)}
                    className={cn(
                      "cursor-pointer border-none transition-colors",
                      "hover:bg-gray-200 dark:hover:bg-secondary",
                      index % 2 !== 0 && "bg-secondary/70",
                      isExpanded && "bg-secondary"
                    )}
                  >
                    <TableCell className="border-r border-secondary last:border-none">
                      {(page - 1) * (data.page_size ?? 10) + index + 1}
                    </TableCell>

                    <TableCell className="border-r border-secondary last:border-none">
                      {order.loading_name}
                    </TableCell>

                    <TableCell className="border-r border-secondary last:border-none">
                      {order.unloading_name}
                    </TableCell>

                    <TableCell className="border-r border-secondary last:border-none text-muted-foreground">
                      {order.cargo_type_name ?? "—"}
                    </TableCell>

                    <TableCell className="border-r border-secondary last:border-none font-semibold">
                      {order.payments?.[0]?.amount
                        ? Number(order.payments[0].amount).toLocaleString("uz-UZ")
                        : "—"}
                    </TableCell>

                    <TableCell className="border-r border-secondary last:border-none">
                      {order.payments?.[0]?.currency === 1
                        ? "UZS"
                        : order.payments?.[0]?.currency === 2
                        ? "USD"
                        : "—"}
                    </TableCell>

                    <TableCell className="border-r border-secondary last:border-none">
                      {order.created
                        ? format(
                            new Date(order.created),
                            "dd.MM.yyyy HH:mm"
                          )
                        : "—"}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell
                      className="border-r border-secondary last:border-none cursor-default p-0 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => handleEdit(order, e)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Tahrirlash
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={(e) => handleDelete(order, e)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            O‘chirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                    {/* EXPAND */}
                    <TableCell
                      className="border-r border-secondary last:border-none cursor-default p-0 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="ghost" size="sm">
                        <ChevronDown
                          className={cn(
                            "transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow className="border-none bg-secondary">
                      <TableCell colSpan={9} className="p-0">
                        <OrderTabs />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="pt-4 flex justify-center">
        <ParamPagination
          totalPages={data?.total_pages}
          disabled={isLoading}
        />
      </div>

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
