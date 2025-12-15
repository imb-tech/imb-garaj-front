import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

interface ScrollToBottomButtonProps {
    scrollAreaId: string;
}

export function ScrollToBottomButton({
    scrollAreaId,
}: ScrollToBottomButtonProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const scrollArea = document.getElementById(scrollAreaId);
        if (!scrollArea) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollArea;
            const bottomThreshold = 100;
            setIsVisible(
                scrollHeight - scrollTop - clientHeight > bottomThreshold
            );
        };

        scrollArea.addEventListener("scroll", handleScroll);
        return () => scrollArea.removeEventListener("scroll", handleScroll);
    }, [scrollAreaId]);

    const scrollToBottom = () => {
        const scrollArea = document.getElementById(scrollAreaId);
        if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
        }
    };

    if (!isVisible) return null;

    return (
        <Button
            className="fixed bottom-10 right-6 rounded-full p-2"
            onClick={scrollToBottom}
            size="icon"
        >
            <ArrowDown className="h-4 w-4" />
        </Button>
    );
}
