import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearch } from "@tanstack/react-router"
import clsx from "clsx"

type Props = {
    data: {
        title: string
        value: JSX.Element
        change?: string | boolean
        icon: JSX.Element
        bgColor: string
        badgeBg: string
        textColor: string
        iconLarge: JSX.Element
        status: string
    }
}

const FinanceCard = ({ data }: Props) => {
    const search = useSearch({ strict: false })

    const {
        title,
        value,
        change,
        icon,
        bgColor,
        badgeBg,
        textColor,
        iconLarge,
    } = data

    return (
        <Card
            className={clsx(
                "relative overflow-hidden h-full border-none shadow-none  transition-all",
                `${bgColor}`,
                `${textColor}`,
            )}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium opacity-90">
                        {title}
                    </CardTitle>
                    <div className={`rounded-full ${badgeBg} p-2`}>{icon}</div>
                </div>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold `}>{value} so'm</div>
                {change && (
                    <div className="flex items-center mt-2">
                        <Badge className={`${badgeBg} ${textColor}  border-0`}>
                            {change}
                        </Badge>
                        <span className="text-sm ml-2 opacity-80">
                            o'tgan oyga nisbatan
                        </span>
                    </div>
                )}
            </CardContent>
            <div className="absolute right-4 bottom-2 opacity-20">
                {iconLarge}
            </div>
        </Card>
    )
}

export default FinanceCard
