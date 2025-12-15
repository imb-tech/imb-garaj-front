import { formatPhoneNumber } from "@/lib/format-phone-number"
import { Phone } from "lucide-react"

type Props = {
    phone: string
}

export default function PhoneLink({ phone }: Props) {
    return (
        <a href={`tel:${phone}`} className="flex items-center text-primary gap-2">
            <Phone width={16} />
            {formatPhoneNumber(phone)}
        </a>
    )
}
