import { useView } from "@/hooks/useView"
import { useThemeContext } from "@/layouts/color"
import { useTheme } from "@/layouts/theme"
import { themes } from "@/lib/theme-colors"
import { cn } from "@/lib/utils"
import { Label } from "@radix-ui/react-label"
import { LayoutGrid, Moon, Palette, Sheet, Sun } from "lucide-react"
import { useEffect } from "react"
import { Button } from "../../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { getIcon } from "./getIcon"

const availableThemeColors = [
    {
        name: "Telegram",
        uz: "Telegram",
        icon: "/telegram.svg",
        dark: "bg-blue-700",
    },
    {
        name: "Green",
        uz: "Yashil",
        light: "bg-green-600",
        dark: "bg-green-500",
    },
    {
        name: "Violet",
        uz: "Binafsha",
        light: "bg-violet-600",
        dark: "bg-violet-700",
    },
]

export function ThemeColorToggle() {
    const { themeColor, setThemeColor } = useThemeContext()
    const { theme, setTheme } = useTheme()
    const { view, setView } = useView()

    useEffect(() => {
        const currentPrimary =
            themes[themeColor][theme as "light" | "dark"].primary
        const currentTextColor =
            themes[themeColor][theme as "light" | "dark"].foreground
        const svgString = getIcon(currentPrimary, currentTextColor)
        const blob = new Blob([svgString], { type: "image/svg+xml" })
        const url = URL.createObjectURL(blob)

        let favicon = document.getElementById("favicon") as HTMLLinkElement
        if (favicon) {
            document.head.removeChild(favicon)
        }

        favicon = document.createElement("link")
        favicon.id = "favicon"
        favicon.rel = "icon"
        favicon.type = "image/svg+xml"
        favicon.href = url

        document.head.appendChild(favicon)

        return () => URL.revokeObjectURL(url)
    }, [themeColor, theme])

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" icon={<Palette width={20} />} />
            </PopoverTrigger>
            <PopoverContent className="space-y-4 w-auto">
                <div className="flex items-center justify-between gap-2">
                    <div className="space-y-2">
                        <Label className="text-sm">Rejim</Label>
                        <div className="flex items-center gap-2">
                            <Button
                                icon={<Sun width={16} />}
                                variant={
                                    theme === "light" ? "default" : "secondary"
                                }
                                size="sm"
                                onClick={() => setTheme("light")}
                            >
                                Yorug'
                            </Button>
                            <Button
                                icon={<Moon width={16} />}
                                variant={
                                    theme === "dark" ? "default" : "secondary"
                                }
                                size="sm"
                                onClick={() => setTheme("dark")}
                            >
                                Tungi
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm">Ko'rinish</Label>
                        <div className="flex items-center gap-2">
                            <Button
                                icon={<Sheet width={16} />}
                                variant={
                                    view === "table" ? "default" : "secondary"
                                }
                                size="sm"
                                onClick={() => setView("table")}
                            />
                            <Button
                                icon={<LayoutGrid width={16} />}
                                variant={
                                    view === "card" ? "default" : "secondary"
                                }
                                size="sm"
                                onClick={() => setView("card")}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm">Rang</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableThemeColors.map(
                            ({ name, light, dark, uz, icon }) => (
                                <Button
                                    icon={
                                        icon ?
                                            <img
                                                src={icon}
                                                className="w-5 h-5 object-contain"
                                            />
                                        :   <span
                                                className={cn(
                                                    "rounded-full h-5 w-5",
                                                    theme === "light" ? light
                                                    :   dark,
                                                )}
                                            />
                                    }
                                    size="sm"
                                    variant={
                                        themeColor === name ? "default" : (
                                            "secondary"
                                        )
                                    }
                                    key={name}
                                    className={
                                        themeColor === name ?
                                            " w-auto justify-start gap-2"
                                        :   " justify-start gap-2"
                                    }
                                    onClick={() =>
                                        setThemeColor(name as ThemeColors)
                                    }
                                >
                                    {uz}
                                </Button>
                            ),
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
