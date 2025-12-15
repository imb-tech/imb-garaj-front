import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { ClassNameValue } from "tailwind-merge"

export default function SeeInView({
    url,
    className,
    children,
    fullWidth = false,
}: {
    url: string | null | undefined
    className?: ClassNameValue
    children?: React.ReactNode
    fullWidth?: boolean
}) {
    return (
        <Dialog>
            <DialogTrigger
                onClick={(e) => {
                    e.stopPropagation()
                }}
                className={fullWidth ? "w-full " : "max-w-full"}
            >
                {children ? (
                    children
                ) : (
                    <img
                        src={url || "/images/user.png"}
                        alt="img"
                        onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = "/images/user.png"
                        }}
                        className={cn(className)}
                    />
                )}
            </DialogTrigger>
            <DialogContent
                onClick={(e) => {
                    e.stopPropagation()
                }}
                className="max-w-4xl min-h-64 max-h-[80vh] w-full !p-0   border-none"
            >
                <DialogHeader className="hidden">
                    <DialogTitle className="text-left hidden">
                        {"name"}
                    </DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>{"name"}</DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <img
                    src={url || "/images/user.png"}
                    alt="img"
                    onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = "/images/user.png"
                    }}
                    className="max-h-[80vh] w-full object-contain rounded-lg"
                />
            </DialogContent>
        </Dialog>
    )
}
