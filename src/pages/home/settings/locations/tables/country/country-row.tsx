import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { SETTINGS_COUNTRIES } from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { useGlobalStore } from "@/store/global-store"
import { useNavigate } from "@tanstack/react-router"
import { ChevronDown, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { CountriesDetailRow } from "../table-detail"

interface CountryRowTableType {
    countries: RolesType
    index: number
    colSpan?: number
}

export const CountryRowTable = ({
    countries,
    index,
    colSpan,
}: CountryRowTableType) => {
    // const search = useSearch({ from: "/_main/_settings/locations/" })
    const { setData } = useGlobalStore()
    const { openModal: openCreateModal } = useModal("country-modal")
    const { openModal: openDeleteModal } = useModal("delete")
    // const { country, ...otherSearchParams } = search
    const navigate = useNavigate()

    const cols = [
        {
            value: countries.name,
        },
    ]

    const handleRowClick = () => {
        // const hasId = country === String(countries.id)

        navigate({
            to: "/locations",
        })
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        setData(SETTINGS_COUNTRIES, countries)
        openCreateModal()
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        setData(SETTINGS_COUNTRIES, countries)
        openDeleteModal()
    }

    const totalColSpan = colSpan || 10

    return (
        <>
            <TableRow
                className={`cursor-pointer ${String(countries.id) ? "bg-secondary" : ""}`}
                onClick={handleRowClick}
            >
                <TableCell>{index + 1}</TableCell>

                {cols.map((cell, i) => (
                    <TableCell key={i}>
                        <div className="flex items-center gap-[5px] bg-secondary whitespace-nowrap rounded-lg px-3 py-2">
                            {cell?.value}
                        </div>
                    </TableCell>
                ))}

                <TableCell className="p-0 text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEdit}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Tahrirlash
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleDelete}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                O'chirish
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>

                <TableCell className="text-right p-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleRowClick()
                        }}
                    >
                        <ChevronDown
                            className={`h-5 w-5 transition-transform 
                                 "rotate-180"
                                :   ""
                            }`}
                        />
                    </Button>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={totalColSpan} className="p-0">
                    <CountriesDetailRow countries={countries} />
                </TableCell>
            </TableRow>
        </>
    )
}
