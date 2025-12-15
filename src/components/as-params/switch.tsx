import { useNavigate, useSearch } from "@tanstack/react-router"
import { useMemo } from "react"
import { ClassNameValue } from "tailwind-merge"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"

interface IProps {
    wrapperClassName?: ClassNameValue
    paramName: string
    label?: string
    reverse?: boolean
}
export default function ParamSwtich({ paramName, label, reverse }: IProps) {
    const params: any = useSearch({ strict: false })

    const navigate = useNavigate()

    function handleChange(value: boolean) {
        navigate({
            search: {
                ...params,
                [paramName]: reverse ? !value : value || undefined,
            },
        })
    }
    const isChecked = useMemo(
        () => (reverse ? params[paramName] === false : !!params[paramName]),
        [params],
    )

    return (
        <div className="flex items-center gap-2 cursor-pointer">
            <Switch
                checked={isChecked}
                onCheckedChange={handleChange}
                id={paramName}
            />
            <Label htmlFor={paramName}>{label}</Label>
        </div>
    )
}
