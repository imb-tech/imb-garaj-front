import { Check, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const CopyButton = (text: string | number) => {
    const [copied, setCopied] = useState(false)

    return (
        <span
            className={`!text-primary flex items-center gap-1 cursor-pointer`}
            onClick={(v) => {
                v.preventDefault()
                navigator.clipboard.writeText(text?.toString())
                toast.success(text + " Nusxaga olindi")
                setCopied(true)
                setTimeout(() => {
                    setCopied(false)
                }, 1000);
            }}
        >
            {copied ? <Check width={16} /> : <Copy width={16} />}
            {text}
        </span>
    )
}
