import { Skeleton } from "@/components/ui/skeleton"
import { SETTINGS_WAREHOUSE } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

type WarehouseType = {
    id: number
    name: string
}

export const useColumnsLogisticiansTable = () => {
    const { data: warehousesData, isLoading: isLoadingWarehouses } = useGet<{
        results: WarehouseType[]
    }>(SETTINGS_WAREHOUSE)

    const warehouseMap = useMemo(() => {
        if (!warehousesData?.results) return {}

        return warehousesData.results.reduce(
            (acc: Record<string, string>, warehouse: WarehouseType) => {
                acc[warehouse.id] = warehouse.name
                return acc
            },
            {},
        )
    }, [warehousesData])

    return useMemo<ColumnDef<LogisticiansType>[]>(
        () => [
            {
                accessorKey: "full_name",
                header: "F.I.O",
                enableSorting: true,
            },
            {
                accessorKey: "phone",
                header: "Telefon raqami",
                enableSorting: true,
            },
            {
                accessorKey: "depot",
                header: "Ombor",
                enableSorting: true,
                cell: ({ row }) => {
                    const depotId = row.getValue("depot")

                    if (isLoadingWarehouses) {
                        return <Skeleton className="h-4 w-20" />
                    }

                    if (!depotId && depotId !== 0) return "-"

                    const depotName = warehouseMap[depotId.toString()]
                    return depotName || depotId
                },
            },
            {
                accessorKey: "username",
                header: "Login",
                enableSorting: true,
            },
        ],
        [warehouseMap, isLoadingWarehouses],
    )
}
