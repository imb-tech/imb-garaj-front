import { useEffect } from "react"

export const useAutoResize = (ref: any, value: string, extraTrigger?: any) => {
    useEffect(() => {
        const element = ref.current
        if (!element) return

        setTimeout(() => {
            element.style.height = "auto"
            element.style.height = `${Math.min(
                element.scrollHeight,
                window.innerHeight * 0.5
            )}px`
        }, 50)
    }, [value, extraTrigger])
}
