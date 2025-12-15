import { useContext } from "react"
import { PromptWithCauseContext } from "@/layouts/prompt-with-causer"

export const usePromptWithCauser = () => {
    const context = useContext(PromptWithCauseContext)
    if (!context) {
        throw new Error(
            "usePromptWithCauser must be used within a PromptWithCauseProvider",
        )
    }
    return context.prompt
}
