import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

type Node = { id: string; label: string; value: number; color: string }

const TUSHUM = {
    total: { id: "total", label: "Tushum", value: 170_000_000, color: "#00e5a0" },
    categories: [
        { id: "c1", label: "Yuk tashish", value: 85_000_000, color: "#00e5a0" },
        { id: "c2", label: "Shartnoma", value: 42_000_000, color: "#06b6d4" },
        { id: "c3", label: "Logistika", value: 28_000_000, color: "#8b5cf6" },
        { id: "c4", label: "Ijara", value: 15_000_000, color: "#f59e0b" },
    ] as Node[],
    items: [
        { id: "i1", label: "Toshkent–Samarqand", value: 32_000_000, color: "#00e5a0", cat: "c1" },
        { id: "i2", label: "Buxoro–Navoiy", value: 28_000_000, color: "#00e5a0", cat: "c1" },
        { id: "i3", label: "Farg'ona yuk", value: 25_000_000, color: "#00e5a0", cat: "c1" },
        { id: "i4", label: "Artel — oylik", value: 22_000_000, color: "#06b6d4", cat: "c2" },
        { id: "i5", label: "Nestle — oylik", value: 20_000_000, color: "#06b6d4", cat: "c2" },
        { id: "i6", label: "Ombor xizmati", value: 16_000_000, color: "#8b5cf6", cat: "c3" },
        { id: "i7", label: "Express yetkazish", value: 12_000_000, color: "#8b5cf6", cat: "c3" },
        { id: "i8", label: "Furgon ijarasi", value: 15_000_000, color: "#f59e0b", cat: "c4" },
    ] as (Node & { cat: string })[],
}

const XARAJAT = {
    total: { id: "total", label: "Xarajat", value: 140_000_000, color: "#f43f5e" },
    categories: [
        { id: "c1", label: "Yoqilg'i", value: 65_000_000, color: "#f43f5e" },
        { id: "c2", label: "Ta'mirlash", value: 35_000_000, color: "#f97316" },
        { id: "c3", label: "Ish haqi", value: 28_000_000, color: "#a855f7" },
        { id: "c4", label: "Yo'l to'lovi", value: 12_000_000, color: "#ec4899" },
    ] as Node[],
    items: [
        { id: "i1", label: "Diesel", value: 32_000_000, color: "#f43f5e", cat: "c1" },
        { id: "i2", label: "Benzin AI-92", value: 18_000_000, color: "#f43f5e", cat: "c1" },
        { id: "i3", label: "Gaz LPG", value: 15_000_000, color: "#f43f5e", cat: "c1" },
        { id: "i4", label: "Dvigatel ta'miri", value: 20_000_000, color: "#f97316", cat: "c2" },
        { id: "i5", label: "Shinalar", value: 15_000_000, color: "#f97316", cat: "c2" },
        { id: "i6", label: "Haydovchi maoshi", value: 18_000_000, color: "#a855f7", cat: "c3" },
        { id: "i7", label: "Mexanik maoshi", value: 10_000_000, color: "#a855f7", cat: "c3" },
        { id: "i8", label: "Yo'l to'lovi", value: 12_000_000, color: "#ec4899", cat: "c4" },
    ] as (Node & { cat: string })[],
}

const formatSum = (v: number) => {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M"
    if (v >= 1_000) return (v / 1_000).toFixed(0) + "K"
    return String(v)
}

function curvePath(x1: number, y1: number, x2: number, y2: number) {
    const cx = (x1 + x2) / 2
    return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`
}

type LayoutNode = Node & { x: number; cy: number; h: number }

function layoutColumn(nodes: Node[], x: number, areaH: number, padY: number): LayoutNode[] {
    const nodeH = 32
    const totalH = nodes.length * nodeH
    const gap = (areaH - padY * 2 - totalH) / Math.max(1, nodes.length - 1)
    let y = padY
    return nodes.map((n) => {
        const out = { ...n, x, cy: y + nodeH / 2, h: nodeH }
        y += nodeH + Math.max(gap, 6)
        return out
    })
}

// Full canvas size for the graph (virtual coordinates)
const CANVAS_W = 800
const CANVAS_H = 500

function textWidth(label: string, fontSize: number) {
    return Math.max(70, label.length * fontSize * 0.55 + 30)
}

function buildLayout(data: typeof TUSHUM) {
    const padY = 20
    const catW = Math.max(90, ...data.categories.map((c) => textWidth(c.label, 9)))
    const itemW = Math.max(90, ...data.items.map((i) => textWidth(i.label, 9)))
    const totalW = 90

    const totalNode: LayoutNode = { ...data.total, x: 10, cy: CANVAS_H / 2, h: 70 }
    const colCats = layoutColumn(data.categories, totalW + 80, CANVAS_H, padY)
    const colItems = layoutColumn(data.items, CANVAS_W - itemW - 10, CANVAS_H, padY)
    const nw = Math.max(catW, itemW, totalW)

    const links: { x1: number; y1: number; x2: number; y2: number; color: string }[] = []
    for (const cat of colCats) {
        links.push({ x1: totalNode.x + totalW, y1: totalNode.cy, x2: cat.x, y2: cat.cy, color: cat.color })
    }
    for (const item of colItems) {
        const catId = (data.items.find((i) => i.id === item.id) as any)?.cat
        const cat = colCats.find((c) => c.id === catId)
        if (cat) links.push({ x1: cat.x + catW, y1: cat.cy, x2: item.x, y2: item.cy, color: item.color })
    }

    return { nodes: [[totalNode], colCats, colItems], links, nw, totalW, catW, itemW }
}

export default function FlowChart() {
    const [mode, setMode] = useState<"tushum" | "xarajat">("tushum")
    const containerRef = useRef<HTMLDivElement>(null)
    const [size, setSize] = useState({ w: 500, h: 280 })

    // Pan & zoom state
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })
    const isPanning = useRef(false)
    const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 })

    useEffect(() => {
        if (!containerRef.current) return
        const ro = new ResizeObserver((entries) => {
            const { width, height } = entries[0].contentRect
            if (width > 0 && height > 0) {
                setSize({ w: width, h: height })
            }
        })
        ro.observe(containerRef.current)
        return () => ro.disconnect()
    }, [])

    const isExpanded = size.h > 400

    const data = mode === "tushum" ? TUSHUM : XARAJAT
    const layout = useMemo(() => buildLayout(data), [data])

    const fitView = useCallback(() => {
        const scaleX = size.w / CANVAS_W
        const scaleY = size.h / CANVAS_H
        const s = Math.min(scaleX, scaleY) * 0.92
        setPan({ x: (size.w - CANVAS_W * s) / 2, y: (size.h - CANVAS_H * s) / 2 })
        setZoom(s)
    }, [size.w, size.h])

    // Re-fit after size settles
    useEffect(() => { fitView() }, [fitView, mode])

    // Wheel/pinch zoom toward mouse position when expanded
    useEffect(() => {
        if (!isExpanded || !containerRef.current) return
        const el = containerRef.current
        const onWheel = (e: WheelEvent) => {
            if (e.ctrlKey || Math.abs(e.deltaY) < 4) {
                e.preventDefault()
                const factor = e.deltaY > 0 ? 0.92 : 1.08
                const rect = el.getBoundingClientRect()
                const mx = e.clientX - rect.left
                const my = e.clientY - rect.top

                setZoom((prevZoom) => {
                    const newZoom = Math.max(0.2, Math.min(4, prevZoom * factor))
                    const scale = newZoom / prevZoom
                    setPan((prevPan) => ({
                        x: mx - scale * (mx - prevPan.x),
                        y: my - scale * (my - prevPan.y),
                    }))
                    return newZoom
                })
            }
        }
        el.addEventListener("wheel", onWheel, { passive: false })
        return () => el.removeEventListener("wheel", onWheel)
    }, [isExpanded])

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        isPanning.current = true
        panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
    }, [pan])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isPanning.current) return
        setPan({
            x: panStart.current.px + (e.clientX - panStart.current.x),
            y: panStart.current.py + (e.clientY - panStart.current.y),
        })
    }, [])

    const handleMouseUp = useCallback(() => { isPanning.current = false }, [])

    const { totalW, catW, itemW } = layout
    const getNodeW = (id: string) => {
        if (id === "total") return totalW
        if (id.startsWith("c")) return catW
        return itemW
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Controls */}
            <div className="flex items-center justify-between px-3 pt-2 shrink-0">
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setMode("tushum")}
                        className={cn(
                            "px-3 py-1 rounded-md text-xs font-medium transition-all",
                            mode === "tushum" ? "bg-emerald-500/15 text-emerald-500" : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        Tushum
                    </button>
                    <button
                        onClick={() => setMode("xarajat")}
                        className={cn(
                            "px-3 py-1 rounded-md text-xs font-medium transition-all",
                            mode === "xarajat" ? "bg-rose-500/15 text-rose-500" : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        Xarajat
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setZoom((z) => Math.min(3, z * 1.25))}
                        className="size-6 rounded flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                        +
                    </button>
                    <button
                        onClick={() => setZoom((z) => Math.max(0.3, z * 0.8))}
                        className="size-6 rounded flex items-center justify-center text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                        −
                    </button>
                    <button
                        onClick={fitView}
                        className="h-6 px-2 rounded text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                        Reset
                    </button>
                    <span className="text-[10px] text-muted-foreground/50 ml-1">{Math.round(zoom * 100)}%</span>
                </div>
            </div>

            {/* Canvas */}
            <div
                ref={containerRef}
                className="flex-1 min-h-0 cursor-grab active:cursor-grabbing overflow-hidden"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <svg width={size.w} height={size.h} className="w-full h-full">
                    <g
                        transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}
                        style={{ transition: isPanning.current ? "none" : "transform 60ms linear" }}
                    >
                        {/* Links */}
                        {layout.links.map((l, i) => (
                            <path
                                key={i}
                                d={curvePath(l.x1, l.y1, l.x2, l.y2)}
                                fill="none"
                                stroke={l.color}
                                strokeWidth={1.2}
                                opacity={0.2}
                                className="hover:opacity-50 transition-opacity"
                                style={{ pointerEvents: "visibleStroke" }}
                            />
                        ))}

                        {/* Nodes */}
                        {layout.nodes.flat().map((n) => {
                            const isTotal = n.id === "total"
                            const nh = n.h
                            const ny = n.cy - nh / 2
                            const w = getNodeW(n.id)

                            return (
                                <g key={`${mode}-${n.id}`}>
                                    <rect
                                        x={n.x} y={ny} width={w} height={nh}
                                        rx={isTotal ? nh / 2 : 6}
                                        fill={n.color}
                                        opacity={isTotal ? 0.15 : 0.08}
                                    />
                                    {isTotal && (
                                        <rect
                                            x={n.x} y={ny} width={w} height={nh}
                                            rx={nh / 2}
                                            fill="none" stroke={n.color} strokeWidth={1.5} opacity={0.35}
                                        />
                                    )}
                                    <text
                                        x={isTotal ? n.x + w / 2 : n.x + 8}
                                        y={n.cy - 3}
                                        fontSize={isTotal ? 11 : 9}
                                        fontWeight={isTotal ? 700 : 500}
                                        fill="currentColor"
                                        className="text-foreground"
                                        textAnchor={isTotal ? "middle" : "start"}
                                    >
                                        {n.label}
                                    </text>
                                    <text
                                        x={isTotal ? n.x + w / 2 : n.x + 8}
                                        y={n.cy + 10}
                                        fontSize={isTotal ? 10 : 8}
                                        fill={n.color}
                                        fontWeight={500}
                                        textAnchor={isTotal ? "middle" : "start"}
                                    >
                                        {formatSum(n.value)}
                                    </text>
                                    {/* Connection dots */}
                                    <circle cx={n.x + w} cy={n.cy} r={2.5} fill={n.color} opacity={0.5} />
                                    {!isTotal && <circle cx={n.x} cy={n.cy} r={2} fill={n.color} opacity={0.3} />}
                                </g>
                            )
                        })}
                    </g>
                </svg>
            </div>
        </div>
    )
}
