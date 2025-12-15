import React, { useCallback, useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { PauseCircle, PlayCircle } from "lucide-react";
import { useWavesurfer } from "@wavesurfer/react";
import { useThemeContext } from "@/layouts/color";
import { useTheme } from "@/layouts/theme";
import { themes } from "@/lib/theme-colors";

let activeWaveSurfer: WaveSurfer | null = null;

const AudioPlayer: React.FC<{ audioUrl: string }> = ({ audioUrl }) => {
    const containerRef = useRef<any | null>(null);
    const { themeColor } = useThemeContext();
    const { theme } = useTheme();

    const currentPrimary =
        themes[themeColor][theme as "light" | "dark"].primary;
    const accentColor = themes[themeColor][theme as "light" | "dark"].accent;

    const { wavesurfer, isPlaying } = useWavesurfer({
        container: containerRef,
        waveColor: `hsl(${accentColor?.split(" ")?.join(",")})`,
        progressColor: `hsl(${currentPrimary?.split(" ")?.join(",")})`,
        cursorWidth: 0,
        barWidth: 2,
        barHeight: 5.5,
        barRadius: 1,
        height: 36,
        hideScrollbar: true,
        url: audioUrl,
        backend: "WebAudio",
    });

    const handlePlayPause = useCallback(() => {
        if (wavesurfer) {
            if (activeWaveSurfer && activeWaveSurfer !== wavesurfer) {
                activeWaveSurfer.stop();
            }

            if (activeWaveSurfer === wavesurfer) {
                wavesurfer.playPause();
                activeWaveSurfer = null;
            } else {
                wavesurfer.play();
                activeWaveSurfer = wavesurfer;
            }
        }
    }, [wavesurfer]);

    useEffect(() => {
        return () => {
            if (wavesurfer) {
                wavesurfer.destroy();
                if (activeWaveSurfer === wavesurfer) {
                    activeWaveSurfer = null;
                }
            }
        };
    }, [wavesurfer]);

    return (
        <div className="flex items-center gap-2 rounded-md border w-full px-2 h-10">
            <button
                onClick={handlePlayPause}
                type="button"
                className="text-primary-foreground"
            >
                {isPlaying ? (
                    <PauseCircle className="fill-primary" width={25} />
                ) : (
                    <PlayCircle className="fill-primary" width={25} />
                )}
            </button>
            <div ref={containerRef} className="w-full" />
        </div>
    );
};

export default AudioPlayer;
