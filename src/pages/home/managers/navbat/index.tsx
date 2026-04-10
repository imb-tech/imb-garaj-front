import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import {
    RefreshCw,
    Truck,
    HardHat,
    Users,
    Clock,
    UserPlus,
    ArrowDown,
    ArrowUp,
    UserMinus,
    Loader2,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { mockDrivers, mockExcavators } from "./mock-data"
import {
    DRIVER_STATUS_COLORS,
    DRIVER_STATUS_LABELS,
    EXCAVATOR_STATUS_COLORS,
    EXCAVATOR_STATUS_LABELS,
    type Excavator,
    type QueueDriver,
} from "./types"

export default function NavbatPage() {
    const [drivers, setDrivers] = useState<QueueDriver[]>(mockDrivers)
    const [excavators] = useState<Excavator[]>(mockExcavators)
    const [autoRefresh, setAutoRefresh] = useState(true)
    const [lastUpdated, setLastUpdated] = useState(new Date())

    useEffect(() => {
        if (!autoRefresh) return
        const interval = setInterval(() => {
            setLastUpdated(new Date())
        }, 30000)
        return () => clearInterval(interval)
    }, [autoRefresh])

    const handleRemoveFromQueue = useCallback((driverId: number) => {
        setDrivers((prev) =>
            prev.map((d) =>
                d.id === driverId
                    ? { ...d, status: "available" as const, position: null, excavator_id: null }
                    : d,
            ),
        )
        toast.success("Haydovchi navbatdan chiqarildi")
    }, [])

    const handleMoveDriver = useCallback(
        (driverId: number, direction: "up" | "down") => {
            setDrivers((prev) => {
                const driver = prev.find((d) => d.id === driverId)
                if (!driver || driver.position === null || !driver.excavator_id) return prev

                const sameExcQueue = prev
                    .filter(
                        (d) =>
                            d.excavator_id === driver.excavator_id &&
                            d.status === "in_queue" &&
                            d.position !== null,
                    )
                    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

                const idx = sameExcQueue.findIndex((d) => d.id === driverId)
                const swapIdx = direction === "up" ? idx - 1 : idx + 1
                if (swapIdx < 0 || swapIdx >= sameExcQueue.length) return prev

                const swapDriver = sameExcQueue[swapIdx]
                return prev.map((d) => {
                    if (d.id === driverId) return { ...d, position: swapDriver.position }
                    if (d.id === swapDriver.id) return { ...d, position: driver.position }
                    return d
                })
            })
        },
        [],
    )

    const handleAddToQueue = useCallback(
        (driverId: number, excavatorId: number) => {
            setDrivers((prev) => {
                const excQueue = prev.filter(
                    (d) => d.excavator_id === excavatorId && d.status === "in_queue",
                )
                const maxPos = excQueue.reduce((max, d) => Math.max(max, d.position ?? 0), 0)
                return prev.map((d) =>
                    d.id === driverId
                        ? {
                              ...d,
                              status: "in_queue" as const,
                              position: maxPos + 1,
                              excavator_id: excavatorId,
                              arrival_time: new Date().toLocaleTimeString("uz", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                              }),
                          }
                        : d,
                )
            })
            toast.success("Haydovchi navbatga qo'shildi")
        },
        [],
    )

    const activeExcavators = excavators.filter((e) => e.status === "active")
    const totalInQueue = drivers.filter((d) => d.status === "in_queue").length
    const totalAvailable = drivers.filter((d) => d.status === "available").length
    const totalLoading = drivers.filter((d) => d.status === "loading").length

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-semibold">Navbat boshqaruvi</h1>
                    <Badge>{drivers.length}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        {lastUpdated.toLocaleTimeString("uz", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                            setLastUpdated(new Date())
                            toast.success("Yangilandi")
                        }}
                    >
                        <RefreshCw size={14} />
                        Yangilash
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    icon={<Users size={18} className="text-blue-500" />}
                    label="Jami haydovchilar"
                    value={drivers.length}
                />
                <StatCard
                    icon={<Clock size={18} className="text-orange-500" />}
                    label="Navbatda"
                    value={totalInQueue}
                />
                <StatCard
                    icon={<Truck size={18} className="text-green-500" />}
                    label="Bo'sh"
                    value={totalAvailable}
                />
                <StatCard
                    icon={<HardHat size={18} className="text-purple-500" />}
                    label="Yuklanmoqda"
                    value={totalLoading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Excavator queues — accordion table */}
                <div className="lg:col-span-7 space-y-3">
                    <h2 className="text-lg font-medium">Ekskavatorlar navbati</h2>
                    <div className="rounded-md border bg-card">
                        <Accordion type="multiple" defaultValue={excavators.filter(e => e.status === "active").map(e => String(e.id))}>
                            {excavators.map((exc) => {
                                const excDrivers = drivers.filter((d) => d.excavator_id === exc.id)
                                const loadingDriver = excDrivers.find((d) => d.status === "loading")
                                const queuedDrivers = excDrivers
                                    .filter((d) => d.status === "in_queue")
                                    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))

                                return (
                                    <AccordionItem key={exc.id} value={String(exc.id)} className="border-b last:border-b-0">
                                        <AccordionTrigger className="px-3 sm:px-4 py-3 hover:no-underline hover:bg-muted/50">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 flex-1">
                                                <span className="font-medium text-sm text-left">{exc.name} ({exc.number})</span>
                                                <div className="sm:ml-auto flex items-center gap-2 sm:mr-2">
                                                    <Badge variant="outline" className={cn("text-xs", EXCAVATOR_STATUS_COLORS[exc.status])}>
                                                        {EXCAVATOR_STATUS_LABELS[exc.status]}
                                                    </Badge>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {queuedDrivers.length} ta navbatda
                                                    </Badge>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-3 sm:px-4 pb-3">
                                            {loadingDriver && (
                                                <div className="mb-3 rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-orange-600">
                                                        <Loader2 size={14} className="animate-spin" />
                                                        Yuklanmoqda
                                                    </div>
                                                    <div className="mt-1 flex items-center justify-between">
                                                        <span className="text-sm font-medium">{loadingDriver.name}</span>
                                                        <span className="text-xs text-muted-foreground">{loadingDriver.truck_number}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {queuedDrivers.length > 0 ? (
                                                <>
                                                    {/* Desktop table */}
                                                    <div className="hidden sm:block">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow className="border-none">
                                                                    <TableHead className="px-2 w-8">#</TableHead>
                                                                    <TableHead className="px-2">Haydovchi</TableHead>
                                                                    <TableHead className="px-2">Avto raqami</TableHead>
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
                                                                        <TableCell className="px-2 font-medium">{idx + 1}</TableCell>
                                                                        <TableCell className="px-2">{driver.name}</TableCell>
                                                                        <TableCell className="px-2 text-muted-foreground">{driver.truck_number}</TableCell>
                                                                        <TableCell className="px-2 text-muted-foreground">{driver.arrival_time || "-"}</TableCell>
                                                                        <TableCell className="px-2">
                                                                            <div className="flex items-center gap-1">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-7 w-7"
                                                                                    disabled={idx === 0}
                                                                                    onClick={() => handleMoveDriver(driver.id, "up")}
                                                                                >
                                                                                    <ArrowUp size={14} />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-7 w-7"
                                                                                    disabled={idx === queuedDrivers.length - 1}
                                                                                    onClick={() => handleMoveDriver(driver.id, "down")}
                                                                                >
                                                                                    <ArrowDown size={14} />
                                                                                </Button>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="icon"
                                                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                                                    onClick={() => handleRemoveFromQueue(driver.id)}
                                                                                >
                                                                                    <UserMinus size={14} />
                                                                                </Button>
                                                                            </div>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>

                                                    {/* Mobile cards */}
                                                    <div className="sm:hidden space-y-2">
                                                        {queuedDrivers.map((driver, idx) => (
                                                            <div
                                                                key={driver.id}
                                                                className={cn(
                                                                    "rounded-lg border p-3",
                                                                    idx % 2 !== 0 && "bg-zinc-200/70 dark:bg-secondary/70",
                                                                )}
                                                            >
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                                                            {idx + 1}
                                                                        </span>
                                                                        <div>
                                                                            <div className="font-medium text-sm">{driver.name}</div>
                                                                            <div className="text-xs text-muted-foreground">{driver.truck_number}</div>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-xs text-muted-foreground">{driver.arrival_time || "-"}</span>
                                                                </div>
                                                                <div className="mt-2 flex items-center justify-end gap-1">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        disabled={idx === 0}
                                                                        onClick={() => handleMoveDriver(driver.id, "up")}
                                                                    >
                                                                        <ArrowUp size={16} />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8"
                                                                        disabled={idx === queuedDrivers.length - 1}
                                                                        onClick={() => handleMoveDriver(driver.id, "down")}
                                                                    >
                                                                        <ArrowDown size={16} />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                                        onClick={() => handleRemoveFromQueue(driver.id)}
                                                                    >
                                                                        <UserMinus size={16} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : (
                                                !loadingDriver && (
                                                    <div className="py-4 text-center text-sm text-muted-foreground">
                                                        Navbatda haydovchi yo'q
                                                    </div>
                                                )
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </div>
                </div>

                {/* All drivers */}
                <div className="lg:col-span-5">
                    <h2 className="text-lg font-medium mb-3">Barcha haydovchilar</h2>

                    {/* Desktop table */}
                    <div className="hidden sm:block rounded-md border bg-card">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-none">
                                    <TableHead className="px-3">Haydovchi</TableHead>
                                    <TableHead className="px-3">Avto</TableHead>
                                    <TableHead className="px-3">Holati</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {drivers.map((driver, idx) => (
                                    <TableRow
                                        key={driver.id}
                                        className={cn(
                                            "border-transparent",
                                            idx % 2 !== 0 &&
                                                "bg-zinc-200/70 dark:bg-secondary/70",
                                        )}
                                    >
                                        <TableCell className="px-3">
                                            <div>
                                                <div className="font-medium text-sm">
                                                    {driver.name}
                                                </div>
                                                {driver.location && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {driver.location}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-3 text-sm text-muted-foreground">
                                            {driver.truck_number}
                                        </TableCell>
                                        <TableCell className="px-3">
                                            <div className="flex flex-col items-start gap-1">
                                                <Badge
                                                    variant="outline"
                                                    className={DRIVER_STATUS_COLORS[driver.status]}
                                                >
                                                    {DRIVER_STATUS_LABELS[driver.status]}
                                                </Badge>
                                                {driver.status === "available" && (
                                                    <DropdownAssign
                                                        excavators={activeExcavators}
                                                        onAssign={(excId) =>
                                                            handleAddToQueue(driver.id, excId)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile cards */}
                    <div className="sm:hidden space-y-2">
                        {drivers.map((driver, idx) => (
                            <div
                                key={driver.id}
                                className={cn(
                                    "rounded-lg border bg-card p-3",
                                    idx % 2 !== 0 && "bg-zinc-200/70 dark:bg-secondary/70",
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-medium text-sm">{driver.name}</div>
                                        {driver.location && (
                                            <div className="text-xs text-muted-foreground">{driver.location}</div>
                                        )}
                                        <div className="text-xs text-muted-foreground mt-0.5">{driver.truck_number}</div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge
                                            variant="outline"
                                            className={cn("text-xs", DRIVER_STATUS_COLORS[driver.status])}
                                        >
                                            {DRIVER_STATUS_LABELS[driver.status]}
                                        </Badge>
                                        {driver.status === "available" && (
                                            <DropdownAssign
                                                excavators={activeExcavators}
                                                onAssign={(excId) =>
                                                    handleAddToQueue(driver.id, excId)
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: number
}) {
    return (
        <Card>
            <CardContent className="flex items-center gap-3 py-3">
                {icon}
                <div>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                </div>
            </CardContent>
        </Card>
    )
}

function DropdownAssign({
    excavators,
    onAssign,
}: {
    excavators: Excavator[]
    onAssign: (excId: number) => void
}) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <UserPlus size={14} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0" align="end">
                <Command>
                    <CommandInput placeholder="Ekskavator qidirish..." />
                    <CommandList>
                        <CommandEmpty>Topilmadi</CommandEmpty>
                        <CommandGroup>
                            {excavators.map((exc) => (
                                <CommandItem
                                    key={exc.id}
                                    value={`${exc.name} ${exc.number}`}
                                    onSelect={() => {
                                        onAssign(exc.id)
                                        setOpen(false)
                                    }}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span className="font-medium">{exc.name}</span>
                                        <span className="text-xs text-muted-foreground">{exc.number}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
