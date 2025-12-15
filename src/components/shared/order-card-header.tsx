import { CopyButton } from "@/lib/copy-button";
import { formatDateLabel } from "@/lib/utils";
import { MoveRight } from "lucide-react";

export default function OrderCardHeader({ order }: { order: OrderDispatchData }) {
    return (
        <>
            <header className="flex items-center justify-between gap-4">
                {CopyButton(order.code)}
                <p className="text-sm">
                    {order.client_code}
                </p>
                <p className="text-sm text-muted-foreground">
                    {formatDateLabel(order.date)}
                </p>
            </header>
            <hgroup className="flex items-center justify-between gap-2">
                <p className="text-lg font-medium">{order.loading_name}</p>
                <MoveRight width={20} className="text-primary" />
                <p className="text-lg font-medium">{order.unloading_name}</p>
            </hgroup>
        </>
    )
}
