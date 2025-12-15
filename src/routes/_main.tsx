import Modal from "@/components/custom/modal"
import Header from "@/components/header"
import { AddOrder } from "@/components/header/add-order"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { MANAGERS_ORDERS_NEW } from "@/constants/api-endpoints"
import type { SEARCH_KEY } from "@/constants/default"
import { cn } from "@/lib/utils"
import { useGlobalStore } from "@/store/global-store"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_main")({
    component: MainLayout,
    validateSearch: (s: { [SEARCH_KEY]?: string }) => s,
})

function MainLayout() {
    const { getData } = useGlobalStore()
    const currentRow = getData<OrderDispatchData>(MANAGERS_ORDERS_NEW)

    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <SidebarInset>
                <div className="w-full h-full overflow-y-auto">
                    <div
                        className={cn(
                            "fixed top-0 right-0 z-30 transition-[width,height,padding] w-full",
                        )}
                    >
                        <Header />
                    </div>

                    <main
                        className={cn(
                            "mx-auto p-4 h-full overflow-y-auto   pt-20 flex flex-col pb-10",
                        )}
                    >
                        <Outlet />
                    </main>

                    <Modal
                        size="max-w-3xl"
                        title={`Buyurtma ${currentRow?.id ? "tasdiqlash" : "qo'shish"} `}
                        modalKey="order-create"
                    >
                        <AddOrder />
                    </Modal>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default MainLayout
