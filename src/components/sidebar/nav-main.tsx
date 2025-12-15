import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { MenuItem, useItems, usePaths } from "@/hooks/usePaths"
import { cn } from "@/lib/utils"
import {
    Link,
    useLocation,
    useMatches,
    useNavigate,
} from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"

export function NavMain() {
    const { toggleSidebar, open: sidebarOpen } = useSidebar()
    const mobile = useIsMobile()
    const location = useLocation()
    const navigate = useNavigate()
    const pathname = location.pathname
    const matchest = useMatches()

    const { filteredItems } = usePaths()
    const All = useItems()

    const hasActivePathDeep = (item: MenuItem, pathname: string): boolean => {
        if (pathname.includes(item.path)) {
            return true
        }

        if (item.items && item.items.length > 0) {
            return item.items.some((child) =>
                hasActivePathDeep(child, pathname),
            )
        }

        return false
    }

    return (
        <SidebarGroup>
            <SidebarMenu>
                {All.map(({ label, icon, path, ...item }) => {
                    const hasSubItems = !!item?.items?.[0]?.label
                    const isParentActive = hasActivePathDeep(
                        { label, icon, path, ...item },
                        pathname,
                    )

                    return (
                        <Collapsible
                            key={label}
                            asChild
                            defaultOpen={sidebarOpen && isParentActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                {hasSubItems ?
                                    sidebarOpen ?
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={label}
                                                className={cn(
                                                    isParentActive &&
                                                        "bg-primary/15 text-primary",
                                                )}
                                            >
                                                {icon}
                                                <span>{label}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                    :   <SidebarMenuButton
                                            tooltip={label}
                                            className={cn(
                                                isParentActive &&
                                                    "bg-primary/15 text-primary",
                                            )}
                                            onClick={() => {
                                                if (mobile) {
                                                    toggleSidebar()
                                                }
                                                navigate({ to: path })
                                            }}
                                        >
                                            {icon}
                                            {sidebarOpen && (
                                                <span>{label}</span>
                                            )}
                                        </SidebarMenuButton>

                                :   <Link href={path} className="w-full">
                                        <SidebarMenuButton
                                            tooltip={label}
                                            className={cn(
                                                isParentActive &&
                                                    "bg-primary/15 text-primary",
                                            )}
                                            onClick={() => {
                                                if (mobile) toggleSidebar()
                                            }}
                                        >
                                            {icon}
                                            {sidebarOpen && (
                                                <span>{label}</span>
                                            )}
                                        </SidebarMenuButton>
                                    </Link>
                                }

                                {hasSubItems && sidebarOpen && (
                                    <CollapsibleContent className="bg-background/70 mt-2 rounded-xl p-2 pl-4 space-y-1">
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem
                                                key={subItem.label}
                                            >
                                                <SidebarMenuSubButton
                                                    asChild
                                                    className={cn(
                                                        "border-b hover:rounded-b-md rounded-b-none",
                                                        hasActivePathDeep(
                                                            subItem,
                                                            pathname,
                                                        ) && "rounded-b-md",
                                                    )}
                                                    isActive={hasActivePathDeep(
                                                        subItem,
                                                        pathname,
                                                    )}
                                                >
                                                    <Link
                                                        href={subItem.path}
                                                        onClick={() => {
                                                            if (mobile)
                                                                toggleSidebar()
                                                        }}
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full dark:bg-white bg-zinc-600"></span>
                                                        <span>
                                                            {subItem.label}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </CollapsibleContent>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
