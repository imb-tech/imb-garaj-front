import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import { ColumnDef } from "@tanstack/react-table"
import { Check, X } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

const mockData: SecurityRequestType[] = [
    {
        id: 1,
        car_number: "01 A 777 AA",
        driver_name: "Abdullayev Jasur",
        status: "pending",
        created_at: "2026-04-10T08:30:00Z",
    },
    {
        id: 2,
        car_number: "40 B 123 CB",
        driver_name: "Karimov Sherzod",
        status: "approved",
        created_at: "2026-04-10T07:15:00Z",
    },
    {
        id: 3,
        car_number: "73 C 456 DA",
        driver_name: "Toshmatov Bekzod",
        status: "rejected",
        created_at: "2026-04-09T16:45:00Z",
    },
    {
        id: 4,
        car_number: "01 D 999 AA",
        driver_name: "Raximov Otabek",
        status: "pending",
        created_at: "2026-04-10T09:00:00Z",
    },
    {
        id: 5,
        car_number: "26 E 321 BA",
        driver_name: "Nurmatov Sardor",
        status: "pending",
        created_at: "2026-04-10T09:30:00Z",
    },
]

const SecurityPage = () => {
    const [data, setData] = useState<SecurityRequestType[]>(mockData)

    const handleAction = (id: number, status: "approved" | "rejected") => {
        setData((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status } : item)),
        )
        toast.success(
            status === "approved" ? "Tasdiqlandi" : "Rad etildi",
        )
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
                            <Badge variant="default" className="gap-1">
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
                        <Badge variant="orange" className="gap-1">
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
                    if (
                        s === "approved" ||
                        s === 1 ||
                        s === "rejected" ||
                        s === 2
                    ) {
                        return null
                    }
                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() =>
                                    handleAction(row.original.id, "approved")
                                }
                            >
                                <Check className="w-4 h-4" />
                                Tasdiqlash
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                    handleAction(row.original.id, "rejected")
                                }
                            >
                                <X className="w-4 h-4" />
                                Rad etish
                            </Button>
                        </div>
                    )
                },
            },
        ],
        [],
    )

    return (
        <DataTable
            numeration
            columns={columns}
            data={data}
        />
    )
}

export default SecurityPage
