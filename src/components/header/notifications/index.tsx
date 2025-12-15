import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, parseISO } from "date-fns";
import { Bell } from "lucide-react";
import { useMemo, useRef } from "react";
import { NotificationItem } from "./item";
import { uz } from "date-fns/locale";
import { ScrollToBottomButton } from "./scroll-to-bottom";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Spinner from "@/components/ui/spinner";
import { useInfiniteSocket } from "@/hooks/useInfiniteSocket";

export default function Notifications() {
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop =
                scrollAreaRef.current.scrollHeight;
        }
    };

    const {
        data: notifications,
        ref,
        hasNextPage,
    } = useInfiniteSocket<ListResponse<NotificationItem>>("common/notification-presses/?page_size=10", "notifications");

    const groupedNotifications = useMemo(() => {
        if (!notifications) return null;
        const grouped: Record<string, NotificationItem[]> = {};
        notifications.results?.forEach((notification) => {
            const date = format(parseISO(notification.created_at), "dd-MMMM", {
                locale: uz,
            });
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(notification);
        });
        return grouped;
    }, [notifications]);

    const hasNotReaded = useMemo(() => {
        return notifications?.results?.some((n) => !n.is_read);
    }, [notifications]);

    return (
        <Dialog
            onOpenChange={(isOpen) => isOpen && setTimeout(scrollToBottom, 0)}
        >
            <DialogTrigger asChild>
                <div className="relative w-10 h-10">
                    <Button variant="ghost" icon={<Bell width={20} />} />
                    {!!hasNotReaded && (
                        <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bildirishnomalar</DialogTitle>
                    <VisuallyHidden>
                        <DialogDescription>
                            Shaxsiy va umumiy bildirishnomalar
                        </DialogDescription>
                    </VisuallyHidden>
                </DialogHeader>
                <ScrollArea
                    className="h-[60vh] relative flex flex-col-reverse w-full"
                    id="notifications-scroll-area"
                    ref={scrollAreaRef}
                >
                    {Object.entries(groupedNotifications || []).map(
                        ([date, notifications]) => (
                            <div key={date} className="space-y-2 mt-1">
                                <span className="sticky top-1 z-10 py-1 px-2 text-center text-xs font-medium bg-primary/10 backdrop-blur rounded-full left-[calc(50%-35px)] translate-x-1/2">
                                    {date}
                                </span>
                                {notifications?.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        n={notification}
                                    />
                                ))}
                            </div>
                        )
                    )}
                    {hasNextPage && (
                        <div
                            ref={ref}
                            className="h-10 flex items-center justify-center"
                        >
                            <Spinner />
                        </div>
                    )}
                </ScrollArea>
                <ScrollToBottomButton scrollAreaId="notifications-scroll-area" />
            </DialogContent>
        </Dialog>
    );
}
