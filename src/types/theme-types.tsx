type ThemeColors = "Telegram" | "Green" | "Violet"
interface ThemeColorStateParams {
    themeColor: ThemeColors
    setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>
}
