import { Button } from "@/components/ui/button"
import { useTheme } from "@/layouts/theme"
import { Moon, Sun } from "lucide-react"

export function ThemeColorToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="flex items-center gap-2 w-full">
            {theme === "light" ?
                <Button
                    type="button"
                    className="m-[1px] flex items-center gap-2 w-full"
                    onClick={() => setTheme("dark")}
                >
                    <Moon width={20} />
                </Button>
            :   <Button
                    type="button"
                    className="m-[1px] flex items-center text-primary gap-2 w-full"
                    onClick={() => setTheme("light")}
                >
                    <Sun width={20} />
                </Button>
            }
        </div>
    )
}
