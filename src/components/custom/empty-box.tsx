import { cn } from "@/lib/utils"
import EmptyIcon from "./empty-icon"

export default function EmptyBox({
    data,
    height = "h-[75vh]",
}: {
    data?: any[]
    height?: string
}) {
    if (data?.length) {
        return null
    }
    return (
        <div
            className={cn(
                "w-full flex items-center justify-center flex-col  gap-2",
                height,
            )}
        >
            <EmptyIcon size={60} className="text-foreground/60" />
            <p className="text-foreground/60">Ma'lumot topilmadi</p>
        </div>
    )
}
