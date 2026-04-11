import Modal from "@/components/custom/modal"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import {
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import {
    ROUTE_CONFIG_KEY,
    useRouteConfigsStore,
    type RouteConfig,
} from "@/store/route-configs-store"
import { useSearch } from "@tanstack/react-router"
import { useMemo } from "react"
import { toast } from "sonner"
import TableHeader from "../table-header"
import AddRouteConfigModal from "./add-route"
import { useRouteConfigsColumns, type RouteConfigRow } from "./cols"
import {
    CARGO_TYPE_OPTIONS,
    CLIENT_OPTIONS,
    CURRENCY_OPTIONS,
    findName,
    LOCATION_OPTIONS,
    PAYMENT_TYPE_OPTIONS,
} from "./options"

const RouteConfigsPage = () => {
    const search = useSearch({ strict: false })
    const items = useRouteConfigsStore((s) => s.items)
    const remove = useRouteConfigsStore((s) => s.remove)

    const { getData, setData, clearKey } = useGlobalStore()
    const current = getData<RouteConfig>(ROUTE_CONFIG_KEY)

    const { openModal: openCreateModal } = useModal("create")
    const { openModal: openDeleteModal, closeModal: closeDeleteModal } =
        useModal("delete")

    const columns = useRouteConfigsColumns()

    const enriched: RouteConfigRow[] = useMemo(
        () =>
            items.map((it) => ({
                id: it.id,
                client_name: findName(CLIENT_OPTIONS, it.client),
                loading_name: findName(LOCATION_OPTIONS, it.loading),
                unloading_name: findName(LOCATION_OPTIONS, it.unloading),
                cargo_type_name: findName(CARGO_TYPE_OPTIONS, it.cargo_type),
                payment_type_name: findName(
                    PAYMENT_TYPE_OPTIONS,
                    it.payment_type,
                ),
                currency_name: findName(CURRENCY_OPTIONS, it.currency),
                amount: it.amount,
            })),
        [items],
    )

    const filtered = useMemo(() => {
        const q = (search.route_configs_search ?? "")
            .toString()
            .toLowerCase()
            .trim()
        if (!q) return enriched
        return enriched.filter((r) =>
            [
                r.client_name,
                r.loading_name,
                r.unloading_name,
                r.cargo_type_name,
                r.payment_type_name,
            ]
                .filter(Boolean)
                .some((v) => String(v).toLowerCase().includes(q)),
        )
    }, [enriched, search.route_configs_search])

    const handleEdit = (row: { original: RouteConfigRow }) => {
        const item = items.find((it) => it.id === row.original.id)
        if (item) setData(ROUTE_CONFIG_KEY, item)
        openCreateModal()
    }

    const handleDelete = (row: { original: RouteConfigRow }) => {
        const item = items.find((it) => it.id === row.original.id)
        if (item) setData(ROUTE_CONFIG_KEY, item)
        openDeleteModal()
    }

    const confirmDelete = () => {
        if (current?.id) {
            remove(current.id)
            toast.success("Muvaffaqiyatli o'chirildi", { icon: "✅" })
            clearKey(ROUTE_CONFIG_KEY)
        }
        closeDeleteModal()
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={filtered}
                onDelete={handleDelete}
                onEdit={handleEdit}
                numeration
                head={
                    <TableHeader
                        fileName="Yo'nalishlar"
                        url="excel"
                        storeKey={ROUTE_CONFIG_KEY}
                        searchKey="route_configs_search"
                        pageKey="page"
                    />
                }
            />
            <Modal
                title={
                    current?.id ?
                        "Yo'nalishni tahrirlash"
                    :   "Yo'nalish qo'shish"
                }
                modalKey="create"
                size="max-w-2xl"
                onClose={() => clearKey(ROUTE_CONFIG_KEY)}
            >
                <AddRouteConfigModal />
            </Modal>
            <Modal
                size="max-w-md"
                modalKey="delete"
                onClose={() => clearKey(ROUTE_CONFIG_KEY)}
            >
                <DialogHeader>
                    <DialogTitle className="font-normal max-w-sm">
                        Siz haqiqatdan ham o'chirishni xohlaysizmi?
                    </DialogTitle>
                    <DialogDescription>
                        Bu qaytarib bo'lmas jarayon!!!
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="destructive" onClick={confirmDelete}>
                        O'chirish
                    </Button>
                </DialogFooter>
            </Modal>
        </>
    )
}

export default RouteConfigsPage
