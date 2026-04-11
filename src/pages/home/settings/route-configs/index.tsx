import { ParamCombobox } from "@/components/as-params/combobox"
import DeleteModal from "@/components/custom/delete-modal"
import Modal from "@/components/custom/modal"
import { DataTable } from "@/components/ui/datatable"
import {
    COMMON_DIRECTIONS,
    COMMON_DIRECTIONS_CARGO_TYPES,
    COMMON_DIRECTIONS_CLIENTS,
    COMMON_DIRECTIONS_LOADS,
    SETTINGS_SELECTABLE_PAYMENT_TYPE,
} from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useSearch } from "@tanstack/react-router"
import { useMemo } from "react"
import TableHeader from "../table-header"
import AddRouteConfigModal from "./add-route"
import { type DirectionRow, useDirectionColumns } from "./cols"

type Direction = {
    id: number
    owner: number
    owner_name: string
    load: number
    load_name: string
    unload: number
    unload_name: string
    cargo_type: number
    cargo_type_name: string
    payment_type: number
    currency: 1 | 2
    amount: string | null
    created?: string
    updated?: string
}

type SelectItem = { id: number | string; name: string }

const CURRENCY_OPTIONS: SelectItem[] = [
    { id: 1, name: "UZS" },
    { id: 2, name: "USD" },
]

const RouteConfigsPage = () => {
    const search = useSearch({ strict: false }) as Record<string, any>
    const { getData, setData } = useGlobalStore()
    const item = getData<Direction>(COMMON_DIRECTIONS)

    const { openModal: openDeleteModal } = useModal("delete")
    const { openModal: openCreateModal } = useModal("create")

    const loadFilter = search.load
    const unloadFilter = search.unload
    const ownerFilter = search.owner
    const cargoTypeFilter = search.cargo_type
    const currencyFilter = search.currency

    const { data, isLoading } = useGet<ListResponse<Direction>>(
        COMMON_DIRECTIONS,
        {
            params: {
                search: search.route_configs_search,
                page: search.page,
                page_size: search.page_size,
                load: loadFilter,
                unload: unloadFilter,
                owner: ownerFilter,
                cargo_type: cargoTypeFilter,
                currency: currencyFilter,
            },
        },
    )

    // Cascading filter options from directions endpoints
    const { data: loadsOptions } = useGet<SelectItem[]>(COMMON_DIRECTIONS_LOADS)

    const { data: unloadsOptions } = useGet<SelectItem[]>(
        COMMON_DIRECTIONS_LOADS,
        {
            params: { load: loadFilter },
            enabled: !!loadFilter,
        },
    )

    const { data: clientsOptions } = useGet<SelectItem[]>(
        COMMON_DIRECTIONS_CLIENTS,
        {
            params: { load: loadFilter, unload: unloadFilter },
            enabled: !!loadFilter && !!unloadFilter,
        },
    )

    const { data: cargoTypesOptions } = useGet<SelectItem[]>(
        COMMON_DIRECTIONS_CARGO_TYPES,
        {
            params: {
                load: loadFilter,
                unload: unloadFilter,
                owner: ownerFilter,
            },
            enabled: !!loadFilter && !!unloadFilter && !!ownerFilter,
        },
    )

    // payment_type_name is not joined on the Direction response, so we still
    // need a selectable lookup to display its label.
    const { data: paymentTypeData } = useGet<SelectItem[]>(
        SETTINGS_SELECTABLE_PAYMENT_TYPE,
        { params: { model_name: "payment-type" } },
    )

    const paymentMap = useMemo(
        () =>
            Object.fromEntries(
                (paymentTypeData ?? []).map((i) => [Number(i.id), i.name]),
            ),
        [paymentTypeData],
    )

    const enriched: DirectionRow[] = useMemo(
        () =>
            (data?.results ?? []).map((d) => ({
                id: d.id,
                owner_name: d.owner_name ?? String(d.owner),
                load_name: d.load_name ?? String(d.load),
                unload_name: d.unload_name ?? String(d.unload),
                cargo_type_name: d.cargo_type_name ?? String(d.cargo_type),
                payment_type_name:
                    paymentMap[d.payment_type] ?? String(d.payment_type),
                currency: d.currency,
                amount: d.amount,
            })),
        [data, paymentMap],
    )

    const columns = useDirectionColumns()

    const handleEdit = (row: { original: DirectionRow }) => {
        const original = data?.results?.find((d) => d.id === row.original.id)
        if (original) setData(COMMON_DIRECTIONS, original)
        openCreateModal()
    }

    const handleDelete = (row: { original: DirectionRow }) => {
        const original = data?.results?.find((d) => d.id === row.original.id)
        if (original) setData(COMMON_DIRECTIONS, original)
        openDeleteModal()
    }

    return (
        <>
            <DataTable
                loading={isLoading}
                columns={columns}
                data={enriched}
                onDelete={handleDelete}
                onEdit={handleEdit}
                numeration
                paginationProps={{
                    totalPages: data?.total_pages,
                    paramName: "page",
                    pageSizeParamName: "page_size",
                }}
                head={
                    <div className="flex flex-col gap-3">
                        <TableHeader
                            fileName="Yo'nalishlar"
                            url="excel"
                            storeKey={COMMON_DIRECTIONS}
                            searchKey="route_configs_search"
                            pageKey="page"
                        />
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <ParamCombobox
                                paramName="load"
                                label="Yuklash manzili"
                                options={loadsOptions ?? []}
                                asloClear={[
                                    "unload",
                                    "owner",
                                    "cargo_type",
                                    "page",
                                ]}
                            />
                            <ParamCombobox
                                paramName="unload"
                                label="Yuk tushirish manzili"
                                options={unloadsOptions ?? []}
                                asloClear={["owner", "cargo_type", "page"]}
                                addButtonProps={{ disabled: !loadFilter }}
                            />
                            <ParamCombobox
                                paramName="owner"
                                label="Yuk egasi"
                                options={clientsOptions ?? []}
                                asloClear={["cargo_type", "page"]}
                                addButtonProps={{
                                    disabled: !loadFilter || !unloadFilter,
                                }}
                            />
                            <ParamCombobox
                                paramName="cargo_type"
                                label="Yuk turi"
                                options={cargoTypesOptions ?? []}
                                asloClear={["page"]}
                                addButtonProps={{
                                    disabled:
                                        !loadFilter ||
                                        !unloadFilter ||
                                        !ownerFilter,
                                }}
                            />
                            <ParamCombobox
                                paramName="currency"
                                label="Valyuta"
                                options={CURRENCY_OPTIONS}
                                asloClear={["page"]}
                                isSearch={false}
                            />
                        </div>
                    </div>
                }
            />
            <DeleteModal path={COMMON_DIRECTIONS} id={item?.id} />
            <Modal
                title={
                    item?.id ? "Yo'nalishni tahrirlash" : "Yo'nalish qo'shish"
                }
                modalKey="create"
                size="max-w-2xl"
            >
                <AddRouteConfigModal />
            </Modal>
        </>
    )
}

export default RouteConfigsPage
