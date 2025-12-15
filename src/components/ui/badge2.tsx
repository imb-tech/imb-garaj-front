import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const badgeVariants = cva(
    "inline-flex items-center rounded-sm border px-1.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground",
                secondary: "border-transparent bg-gray-400 dark:bg-gray-400/30 text-white",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground",
                outline: "text-foreground",
                primary:
                    "border-transparent bg-blue-400 dark:bg-blue-400/30 text-white font-medium",
                warning:
                    "border-transparent bg-orange-400 dark:bg-orange-400/30 text-white font-medium ",
                success:
                    "border-transparent bg-green-400 dark:bg-green-400/30 text-white font-medium",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        BadgeVariants {}

function Badge2({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge2 }
