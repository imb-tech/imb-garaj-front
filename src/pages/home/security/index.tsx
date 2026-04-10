import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import { SECURITY_REQUESTS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { usePatch } from "@/hooks/usePatch"
import { useQueryClient } from "@tanstack/react-query"
import { useSearch } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table"
import { Check, X } from "lucide-react"
import { useMemo } from "react"
import { toast } from "sonner"

const SecurityPage = () => {
    const search = useSearch({ strict: false })
    const queryClient = useQueryClient()

    const { data, isLoading } = useGet<ListResponse<SecurityRequestType>>(
        SECURITY_REQUESTS,
        {
            params: {
                page: search.page,
                page_size: search.page_size,
            },
        },
    )

    const { mutate: updateStatus, isPending } = usePatch({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SECURITY_REQUESTS] })
            toast.success("Holat yangilandi")
        },
    })

    const handleAction = (id: number, status: "approved" | "rejected") => {
        updateStatus(`${SECURITY_REQUESTS}/${id}`, { status })
    }

    const columns = useMemo<ColumnDef<SecurityRequestType>[]>(
        () => [
            {
                accessorKey: "car_number",
                header: "Mashina raqami",
            },
            {
                accessorKey: "driver_name",
                header: "Haydovchi",
            },
            {
                accessorKey: "created_at",
                header: "Sana",
                cell: ({ row }) =>
                    new Date(row.original.created_at).toLocaleString("uz-UZ"),
            },
            {
                accessorKey: "status",
                header: "Holati",
                cell: ({ row }) => {
                    const s = row.original.status
                    if (s === "approved" || s === 1) {
                        return (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
                                <Check className="w-3.5 h-3.5" />
                                Tasdiqlangan
                            </Badge>
                        )
                    }
                    if (s === "rejected" || s === 2) {
                        return (
                            <Badge variant="destructive" className="gap-1">
                                <X className="w-3.5 h-3.5" />
                                Rad etilgan
                            </Badge>
                        )
                    }
                    return (
                        <Badge variant="outline" className="gap-1">
                            Kutilmoqda
                        </Badge>
                    )
                },
            },
            {
                id: "actions",
                header: "Amallar",
                cell: ({ row }) => {
                    const s = row.original.status
                    if (s === "approved" || s === 1 || s === "rejected" || s === 2) {
                        return null
                    }
                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                disabled={isPending}
                                onClick={() =>
                                    handleAction(row.original.id, "approved")
                                }
                                className="h-8 gap-1 bg-green-600 hover:bg-green-700"
                            >
                                <Check className="w-4 h-4" />
                                Tasdiqlash
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                disabled={isPending}
                                onClick={() =>
                                    handleAction(row.original.id, "rejected")
                                }
                                className="h-8 gap-1"
                            >
                                <X className="w-4 h-4" />
                                Rad etish
                            </Button>
                        </div>
                    )
                },
            },
        ],
        [isPending],
    )

    return (
        <DataTable
            numeration
            loading={isLoading}
            columns={columns}
            data={data?.results}
            paginationProps={{
                totalPages: data?.total_pages,
                paramName: "page",
                pageSizeParamName: "page_size",
            }}
        />
    )
}

export default SecurityPage
