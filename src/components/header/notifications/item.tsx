import AudioPlayer from "@/components/ui/audio-player";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import SeeInView from "@/components/ui/see-in-view";
import axiosInstance from "@/services/axios-instance";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface NotificationItemProps {
    n: NotificationItem;
}

export function NotificationItem({ n }: NotificationItemProps) {
    const { inView, ref } = useInView();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (inView && !n.is_read) {
            axiosInstance.get(`common/read-press/${n.id}/`).then((res) => {
                if (res.status === 200) {
                    queryClient.setQueryData(
                        ["common/notification-presses/?page_size=10"],
                        (oldData: {
                            total_pages: number;
                            results: NotificationItem[];
                            count: number;
                            current_page: number;
                        }) => ({
                            ...oldData,
                            results: oldData?.results?.map((o) =>
                                o.id === n.id ? { ...o, is_read: true } : o
                            ),
                        })
                    );
                }
            });
        }
    }, [inView]);
    return (
        <Card className={`mb-4`}>
            <CardContent className="p-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage
                                src={n.creator?.profile_photo}
                                alt={n.creator?.first_name}
                                className="object-cover"
                            />
                            <AvatarFallback>
                                {n.creator?.first_name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <p className="font-semibold">
                            {n.creator?.first_name} {n.creator?.last_name}
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        {!!n.image && (
                            <SeeInView url={n.image} className="w-max">
                                <img
                                    src={n?.image}
                                    alt="Notification image"
                                    className="mt-2 rounded-md w-max object-cover"
                                />
                            </SeeInView>
                        )}
                        {!!n.file && <AudioPlayer audioUrl={n?.file} />}
                        <p className="pt-2">{n.title}</p>
                        <p className="text-sm text-muted-foreground text-wrap">
                            {n.description}
                        </p>
                        <p
                            className="text-xs text-muted-foreground text-right"
                            ref={ref}
                        >
                            {n.created_at?.split("T")?.[1].slice(0, 5)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
