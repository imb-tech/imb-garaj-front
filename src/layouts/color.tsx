import setGlobalColorTheme, { themes } from "@/lib/theme-colors"
import { ThemeProviderProps } from "next-themes/dist/types"
import { createContext, useContext, useEffect, useState } from "react"
import { useTheme } from "./theme"

const ThemeContext = createContext<ThemeColorStateParams>(
    {} as ThemeColorStateParams,
)

export default function ThemeDataProvider({ children }: ThemeProviderProps) {
    const getSavedThemeColor = (): ThemeColors => {
        try {
            const saved = localStorage.getItem(
                "themeColor",
            ) as ThemeColors | null
            if (saved && saved in themes) {
                return saved
            }
            return "Telegram"
        } catch (error) {
            return "Telegram"
        }
    }

    const [themeColor, setThemeColor] =
        useState<ThemeColors>(getSavedThemeColor)
    const [isMounted, setIsMounted] = useState(false)
    const { theme } = useTheme()

    useEffect(() => {
        localStorage.setItem("themeColor", themeColor)
        setGlobalColorTheme(theme as "light" | "dark", themeColor)

        if (!isMounted) {
            setIsMounted(true)
        }
    }, [themeColor, theme])

    if (!isMounted) {
        return null
    }

    return (
        <ThemeContext.Provider value={{ themeColor, setThemeColor }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useThemeContext() {
    return useContext(ThemeContext)
}
