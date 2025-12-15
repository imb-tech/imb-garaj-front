import { Control, Controller } from "react-hook-form"
import { Slider } from "../ui/slider"
import FieldError from "./form-error"
import FieldLabel from "./form-label"

export function FormSlider({
    name,
    label,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    required,
    control,
    hideError = true,
}: SliderProps) {
    return (
        <div className="w-full">
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    return (
                        <div className={label ? "flex flex-col gap-1" : ""}>
                            {label && (
                                <FieldLabel
                                    htmlFor={name}
                                    required={!!required}
                                    isError={
                                        !!control._formState.errors?.[name]
                                    }
                                >
                                    {label} ({field.value})
                                </FieldLabel>
                            )}
                            <Slider
                                min={min}
                                max={max}
                                step={step}
                                value={[field.value || min]}
                                onValueChange={(val) => {
                                    field.onChange(val[0])
                                }}
                                disabled={disabled}
                            />
                        </div>
                    )
                }}
            />
            {!hideError && control._formState.errors?.[name] && (
                <FieldError>
                    {control._formState.errors[name]?.message as string}
                </FieldError>
            )}
        </div>
    )
}

interface SliderProps {
    name: string
    label?: string
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    required?: boolean
    control: Control<any>
    hideError?: boolean
}
