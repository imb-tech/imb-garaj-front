import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Skeleton } from "../ui/skeleton"
import { cn } from "@/lib/utils"

type Props = {
    rowCount: number
    columnCount: number
}

function AccordionSkeleton({ columnCount, rowCount }: Props) {
    return (
        <Accordion type="single" collapsible className="w-full">
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <AccordionItem
                    className="border-none"
                    value={`loading-${rowIndex}`}
                    key={rowIndex}
                >
                    <AccordionTrigger
                        className={cn(
                            "bg-card px-3",
                            rowCount - 1 === rowIndex && "rounded-b-md",
                        )}
                        icon={false}
                    >
                        <div
                            className={cn(
                                "w-full gap-4",
                                `grid grid-cols-${columnCount}`,
                            )}
                        >
                            {Array.from({ length: columnCount }).map(
                                (_, colIndex) => (
                                    <Skeleton
                                        key={colIndex}
                                        className="h-8 rounded-md"
                                    />
                                ),
                            )}
                        </div>
                    </AccordionTrigger>
                </AccordionItem>
            ))}
        </Accordion>
    )
}

export default AccordionSkeleton
