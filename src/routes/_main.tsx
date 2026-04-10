import Header from "@/components/header"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import type { SEARCH_KEY } from "@/constants/default"
import { cn } from "@/lib/utils"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_main")({
    component: MainLayout,
    beforeLoad: () => {
        const token = localStorage.getItem("token")
        if (!token) {
            throw redirect({
                to: "/auth",
            })
        }
    },
    validateSearch: (s: { [SEARCH_KEY]?: string }) => s,
})

function MainLayout() {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset className="overflow-y-auto max-h-svh">
                <div className="sticky top-0 z-30">
                    <Header />
                </div>

                <div className="mx-auto p-4 flex flex-col pb-10 w-full">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default MainLayout
