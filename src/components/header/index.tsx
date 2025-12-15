import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { SidebarTrigger, useSidebar } from "../ui/sidebar"
import { ThemeColorToggle } from "./color-toggle"

const Header = ({ type }: { type?: string }) => {
    const { open } = useSidebar()

    return (
        <header className="p-2 gap-4 flex items-center justify-between bg-card border-b border-border max-w-full box-border">
            <div className="flex items-center xl:gap-6 max-w-full overflow-x-auto custom-scrollbar">
                <div
                    className={cn(
                        "flex items-center gap-3 transition-all duration-300 min-w-0",
                        open && "min-w-[13rem]",
                    )}
                >
                    <SidebarTrigger className="text-gray-500 dark:text-white" />
                    <h1 className="font-bold text-primary text-2xl ">GARAJ</h1>
                </div>
            </div>

            <hgroup className="flex items-center gap-2 sm:gap-4">
                <div className="flex sm:gap-2">
                    <ThemeColorToggle />
                </div>
                <DropdownMenu>
                    <div className="relative h-10">
                        <DropdownMenuTrigger className="!outline-none">
                            <Avatar className="relative overflow-hidden">
                                <AvatarImage
                                    src={undefined}
                                    alt="user img"
                                    className="object-cover"
                                />
                                <AvatarFallback>SA</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                    </div>
                </DropdownMenu>
            </hgroup>
        </header>
    )
}

export default Header
