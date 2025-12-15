import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Mic, MicOff, PauseCircle, PlayCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import {
    FieldValues,
    Path,
    RegisterOptions,
    UseFormReturn,
} from "react-hook-form";
import FieldLabel from "@/components/form/form-label";
import FieldError from "@/components/form/form-error";
import { useThemeContext } from "@/layouts/color";
import { themes } from "@/lib/theme-colors";
import { useTheme } from "@/layouts/theme";

interface AudioRecorderProps<IForm extends FieldValues> {
    methods: UseFormReturn<IForm>;
    name: Path<IForm>;
    name2: Path<IForm>;
    label?: string;
    required?: boolean;
    registerOptions?: RegisterOptions<IForm>;
    hideError?: boolean;
}

const FormAudioRecord = <IForm extends FieldValues>({
    methods,
    name,
    name2,
    label,
    required = false,
    registerOptions,
    hideError = true,
}: AudioRecorderProps<IForm>) => {
    const waveformRef = useRef<HTMLDivElement | null>(null);
    const waveSurferRef = useRef<WaveSurfer | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isAudioEnded, setIsAudioEnded] = useState(false);
    const {
        register,
        formState: { errors },
    } = methods;

    const reg = register(name, {
        ...registerOptions,
    });

    const { themeColor } = useThemeContext();
    const { theme } = useTheme();

    useEffect(() => {
        const currentPrimary =
            themes[themeColor][theme as "light" | "dark"].primary;
        const accentColor =
            themes[themeColor][theme as "light" | "dark"].accent;
        waveSurferRef.current = WaveSurfer.create({
            container: waveformRef.current as HTMLDivElement,
            waveColor: `hsl(${accentColor?.split(" ")?.join(",")})`,
            progressColor: `hsl(${currentPrimary?.split(" ")?.join(",")})`,
            cursorColor: "transparent",
            cursorWidth: 0,
            barWidth: 2,
            barHeight: 5.5,
            barRadius: 1,
            height: 28,
            hideScrollbar: true,
            backend: "WebAudio",
        });

        const recordPlugin = RecordPlugin.create({ continuousWaveform: true });
        waveSurferRef.current.registerPlugin(recordPlugin);

        recordPlugin.on("record-end", (blob: Blob) => {
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
            methods.setValue(name2, blob as any);
        });

        return () => {
            waveSurferRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        waveSurferRef.current?.on("finish", () => setIsAudioEnded(true));
        waveSurferRef.current?.on("play", () => {
            setIsPlaying(true);
            setIsAudioEnded(false);
        });
        waveSurferRef.current?.on("pause", () => setIsPlaying(false));
    }, [isPlaying]);

    const startRecording = async () => {
        if (waveSurferRef.current) {
            setIsRecording(true);
            await (
                waveSurferRef.current.getActivePlugins()?.[0] as RecordPlugin
            )?.startMic();
            await (
                waveSurferRef.current.getActivePlugins()?.[0] as RecordPlugin
            )?.startRecording();
            methods.resetField(name);
        }
    };

    const stopRecording = async () => {
        if (waveSurferRef.current) {
            (
                waveSurferRef.current.getActivePlugins()?.[0] as RecordPlugin
            )?.stopRecording();
            (
                waveSurferRef.current.getActivePlugins()?.[0] as RecordPlugin
            )?.stopMic();
            setIsRecording(false);
            setIsAudioEnded(true);
        }
    };

    const handlePlayPause = () => {
        if (waveSurferRef.current) {
            if (isAudioEnded) {
                waveSurferRef.current.seekTo(0);
                setIsAudioEnded(false);
            }
            waveSurferRef.current.playPause();
        }
    };

    const handleClear = () => {
        waveSurferRef.current?.stop();
        setAudioUrl(null);
    };

    return (
        <fieldset className="relative w-full rounded-md flex flex-col">
            {label && (
                <FieldLabel
                    htmlFor={name}
                    required={required}
                    isError={!!errors[name]}
                >
                    {label}
                </FieldLabel>
            )}
            <div className="relative w-full rounded-md">
                <Input
                    {...reg}
                    placeholder={label}
                    fullWidth
                    suffix={
                        audioUrl ? (
                            <span
                                onClick={handleClear}
                                className={cn(
                                    "text-primary",
                                    methods.formState.disabled &&
                                        "opacity-50 pointer-events-none cursor-not-allowed"
                                )}
                            >
                                <X width={16} />
                            </span>
                        ) : (
                            <span
                                onClick={
                                    isRecording ? stopRecording : startRecording
                                }
                                className="text-primary"
                            >
                                {isRecording ? (
                                    <MicOff width={20} />
                                ) : (
                                    <Mic width={20} />
                                )}
                            </span>
                        )
                    }
                    prefixIcon={
                        audioUrl && (
                            <span
                                onClick={handlePlayPause}
                                className="text-primary-foreground"
                            >
                                {isPlaying ? (
                                    <PauseCircle
                                        className="fill-primary"
                                        width={25}
                                    />
                                ) : (
                                    <PlayCircle
                                        className="fill-primary"
                                        width={25}
                                    />
                                )}
                            </span>
                        )
                    }
                    id={name}
                />
                <div
                    className={cn(
                        "top-1 h-8 left-9 flex items-center w-[calc(100%-64px)] right-9 bg-background absolute",
                        isRecording || audioUrl ? "z-10" : "-z-10",
                        isRecording && "left-1 w-[calc(100%-36px)]"
                    )}
                >
                    <div
                        ref={waveformRef}
                        className={`w-full ${methods.formState.disabled ? "pointer-events-none" : ""}`}
                        onClick={handlePlayPause}
                    ></div>
                </div>
            </div>
            {!hideError && errors[name] && (
                <FieldError>{errors[name]?.message as string}</FieldError>
            )}
        </fieldset>
    );
};

export default FormAudioRecord;
