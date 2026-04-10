import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from "@/components/ui/sidebar"
import * as React from "react"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarContent className="lg:pt-16">
                <NavMain />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
