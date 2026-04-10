import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp, Loader2, MapPin, UserMinus } from "lucide-react"
import {
    DRIVER_STATUS_COLORS,
    DRIVER_STATUS_LABELS,
    Excavator,
    EXCAVATOR_STATUS_COLORS,
    EXCAVATOR_STATUS_LABELS,
    QueueDriver,
} from "./types"

interface ExcavatorCardProps {
    excavator: Excavator
    drivers: QueueDriver[]
    onRemoveDriver: (driverId: number) => void
    onMoveDriver: (driverId: number, direction: "up" | "down") => void
}

export default function ExcavatorCard({
    excavator,
    drivers,
    onRemoveDriver,
    onMoveDriver,
}: ExcavatorCardProps) {
    const loadingDriver = drivers.find((d) => d.status === "loading")
    const queuedDrivers = drivers
        .filter((d) => d.status === "in_queue")
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

    const isActive = excavator.status === "active"

    return (
        <Card className={cn(!isActive && "opacity-60")}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{excavator.name}</CardTitle>
                    <Badge
                        variant="outline"
                        className={EXCAVATOR_STATUS_COLORS[excavator.status]}
                    >
                        {EXCAVATOR_STATUS_LABELS[excavator.status]}
                    </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={14} />
                    {excavator.location}
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                {loadingDriver && (
                    <div className="mb-3 rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
                            <Loader2 size={14} className="animate-spin" />
                            Yuklanmoqda
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {loadingDriver.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {loadingDriver.truck_number}
                            </span>
                        </div>
                    </div>
                )}

                {queuedDrivers.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-none">
                                <TableHead className="px-2 w-8">№</TableHead>
                                <TableHead className="px-2">Haydovchi</TableHead>
                                <TableHead className="px-2">Avto</TableHead>
                                <TableHead className="px-2">Kelgan vaqti</TableHead>
                                <TableHead className="px-2 w-24"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {queuedDrivers.map((driver, idx) => (
                                <TableRow
                                    key={driver.id}
                                    className={cn(
                                        "border-transparent",
                                        idx % 2 !== 0 && "bg-zinc-200/70 dark:bg-secondary/70",
                                    )}
                                >
                                    <TableCell className="px-2 font-medium">
                                        {idx + 1}
                                    </TableCell>
                                    <TableCell className="px-2">
                                        {driver.name}
                                    </TableCell>
                                    <TableCell className="px-2 text-muted-foreground">
                                        {driver.truck_number}
                                    </TableCell>
                                    <TableCell className="px-2 text-muted-foreground">
                                        {driver.arrival_time || "-"}
                                    </TableCell>
                                    <TableCell className="px-2">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                disabled={idx === 0}
                                                onClick={() => onMoveDriver(driver.id, "up")}
                                            >
                                                <ArrowUp size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7"
                                                disabled={idx === queuedDrivers.length - 1}
                                                onClick={() => onMoveDriver(driver.id, "down")}
                                            >
                                                <ArrowDown size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-destructive hover:text-destructive"
                                                onClick={() => onRemoveDriver(driver.id)}
                                            >
                                                <UserMinus size={14} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    !loadingDriver && (
                        <div className="py-4 text-center text-sm text-muted-foreground">
                            Navbatda haydovchi yo'q
                        </div>
                    )
                )}

                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Navbatda: {queuedDrivers.length} ta</span>
                    {loadingDriver && <span>Yuklanmoqda: 1</span>}
                </div>
            </CardContent>
        </Card>
    )
}
