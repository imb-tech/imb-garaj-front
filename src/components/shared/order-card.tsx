import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
    DISPATCHERS__CONTROL_WITHDRAW,
    DISPATCHERS__WITHDRAW,
    DISPATCHERS_BOOK_ORDER,
    DISPATCHERS_WAITING_ORDERS,
} from "@/constants/api-endpoints"
import { useModal } from "@/hooks/useModal"
import { usePost } from "@/hooks/usePost"
import convertDate from "@/lib/convertDate"
import convertTime from "@/lib/convertTime"
import { CopyButton } from "@/lib/copy-button"
import { cn } from "@/lib/utils"
import axiosInstance from "@/services/axios-instance"
import { useGlobalStore } from "@/store/global-store"
import { Check, Info, MapPinHouse, MoveRight, Plus, Undo2 } from "lucide-react"
import { toast } from "sonner"
import {
    getColor,
    getTimeDifference,
} from "../../pages/dispatch/dispatch/helper"
import { methodLabels } from "../../pages/dispatch/dispatch/orders"
import Timer from "../../pages/dispatch/dispatch/timer"

interface IProps {
    item: OrderDispatchData
}
 
const OrderCard = ({ item: c }: IProps) => {
    const { openModal: openModalSendInfo } = useModal("send-info-modal")
    const { openModal: openModalSend } = useModal("send-modal")
 
    const { setData } = useGlobalStore()

    const handleSendInfo = (data: string[]) => {
        setData<string[]>("send-info", data)
        openModalSendInfo()
    }

    const { mutate: postBron, isPending: isPendingBron } = usePost({
        onSuccess: (data) => {
            toast.success("Amaliyot muvaffaqiyatli bajarildi")
            handleSendInfo(data)
        },
    })

    const { mutate: postUndo, isPending } = usePost({
        onSuccess: () => {
            toast.success("Amaliyot muvaffaqiyatli bajarildi")
        },
    })

    const dif = getTimeDifference(c.created_at)
    const user_id = localStorage.getItem("user_id") || 0

    async function onSendLocation() {
        const { data } = await axiosInstance.get(DISPATCHERS_WAITING_ORDERS)
        const lon = data?.lon
        const lat = data?.lat
        const groupLink = "https://t.me/lorry_yuk_markazi"

        if (!lon || !lat) {
            toast.error("Lokatsiyasi topilmadi")
            return
        }

        const message = `📍 Zavod manzili: https://maps.google.com/?q=${lat},${lon} 📢 Bizning guruh: ${groupLink}`

        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(message)}`
        window.open(telegramUrl, "_blank")
    }

    return (
        <Card className="relative flex flex-col justify-between h-full overflow-hidden text-sm">
            <CardContent className="p-3  flex flex-col gap-3">
                {c.date ?
                    <span
                        className={cn(
                            "text-xs text-start ",
                            "w-full",
                            getColor("text", dif),
                        )}
                    >
                        {convertTime(c.date)}
                    </span>
                :   null}
                {c.dispatcher?.id && c.dispatcher?.id == user_id && (
                    <span className="ml-1 text-xs font-medium absolute top-0 right-0 bg-red-500/15 text-primary-foreground rounded-bl-lg py-0.5 px-2">
                        <Timer data={c} />
                    </span>
                )}
                <div className="flex items-center justify-between">
                    <div>{CopyButton(c.code)}</div>
                    <span
                        className={cn(
                            "ml-1 text-sm text-center",
                            "w-full",
                            getColor("text", dif),
                        )}
                    >
                        {convertTime(c.date)}
                    </span>
                    <span className="ml-1 text-sm text-nowrap">
                        {convertDate(c.date)}
                    </span>
                </div>

                <div className="flex justify-between items-center -mt-2">
                    <p className="font-medium text-lg">{c.loading_name}</p>
                    <MoveRight width={20} className=" text-primary" />
                    <p className="font-medium text-lg">{c.unloading_name}</p>
                </div>
                <p className="text-muted-foreground justify-between flex gap-2 items-center">
                    <span className="text-foreground">Menejer: </span>
                    <span className="font-medium">{c.creator_name}</span>
                </p>
                <p className="text-muted-foreground justify-between flex gap-2 items-center">
                    <span className="text-foreground">To'lov turi: </span>
                    <span className="font-medium">
                        {(c?.payment_types || [])
                            .map((method) => methodLabels[method] || method)
                            .join(", ")}
                    </span>
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2 ">
                    {c.comment}
                </p>
            </CardContent>

            {true ?
                <CardFooter className="p-2 sm:p-4 !pt-1">
                    {c.dispatcher?.id && c.dispatcher?.id == user_id ?
                        <div className="flex gap-2 w-full">
                            <Button
                                className={cn("w-full")}
                                size="sm"
                                icon={<Check width={16} />}
                                onClick={() => {
                                    setData("dispatch-order", c)
                                    openModalSend()
                                }}
                                disabled={isPending}
                            />
                            <Button
                                className="w-full"
                                size="sm"
                                variant="destructive"
                                icon={<Undo2 width={16} />}
                                onClick={() => {
                                    postUndo(DISPATCHERS__WITHDRAW, {
                                        order: c.id,
                                        dispatcher: c.dispatcher.id,
                                    })
                                }}
                                disabled={isPending}
                            />
                            <div>
                                <Button
                                    icon={<Info width={18} />}
                                    variant="ghost"
                                    className="h-9"
                                    onClick={() => {
                                        handleSendInfo(c.criteria_list)
                                    }}
                                />
                            </div>
                            <div>
                                <Button
                                    icon={<MapPinHouse width={18} />}
                                    variant="ghost"
                                    className="!text-primary h-9"
                                    onClick={onSendLocation}
                                />
                            </div>
                        </div>
                    : c.dispatcher === null ?
                        <Button
                            className={cn("w-full")}
                            size="sm"
                            icon={<Plus size={16} />}
                            onClick={() =>
                                postBron(DISPATCHERS_BOOK_ORDER, {
                                    order: c.id,
                                })
                            }
                            disabled={isPendingBron}
                        >
                            Band qilish
                        </Button>
                    :   <Button variant="ghost" className="w-full">
                            {c.dispatcher?.full_name}
                        </Button>
                    }
                </CardFooter>
            :   <CardFooter className="p-2 sm:p-4 !pt-1">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                            postUndo(DISPATCHERS__CONTROL_WITHDRAW, {
                                order: c.id,
                                dispatcher: c.dispatcher.id,
                            })
                        }}
                    >
                        {c.dispatcher?.full_name}
                        <Undo2 width={18} />
                    </Button>
                </CardFooter>
            }
        </Card>
    )
}

export default OrderCard
