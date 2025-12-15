import { FormCarNumber } from "@/components/form/car-number"
import { FormCombobox } from "@/components/form/combobox"
import { FormDatePicker } from "@/components/form/date-picker"
import { FormFormatNumberInput } from "@/components/form/format-number-input"
import FormImagePicker from "@/components/form/img-picker"
import FormInput from "@/components/form/input"
import { FormMultiCombobox } from "@/components/form/multi-combobox"
import { FormNumberInput } from "@/components/form/number-input"
import { FormSelect } from "@/components/form/select"
import { FormSlider } from "@/components/form/slider"
import { CalendarProps } from "@/components/ui/calendar"
import { FormField } from "@/types/export-types"
import { ReactNode } from "@tanstack/react-router"
import { UseFormReturn } from "react-hook-form"
import { ClassNameValue } from "tailwind-merge"

export const useMakeForm = ({
    f,
    form, 
}: {
    f: FormField & {
        calendarProps?: CalendarProps
        className?: ClassNameValue
        sliderProps?: { min?: number; max?: number; step?: number }
    }
    form: UseFormReturn<any>
}): ReactNode => {
    switch (f.type) {
        case "combobox":
            return (
                <FormCombobox
                    required={f.required}
                    valueKey={f.returnVal}
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    options={f.options}
                    addButtonProps={{
                        disabled: f.disabled,
                    }}
                />
            )
        case "multi-combobox":
            return (
                <FormMultiCombobox
                    required={f.required}
                    valueKey={f.returnVal}
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    options={f.options}
                    addButtonProps={{
                        disabled: f.disabled,
                    }}
                />
            )
        case "money":
            return (
                <FormNumberInput
                    required={f.required}
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    thousandSeparator=" "
                    disabled={f.disabled}
                />
            )
        case "number":
            return (
                <FormNumberInput
                    required={f.required}
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    disabled={f.disabled}
                />
            )
        case "phone_number":
            return (
                <FormFormatNumberInput
                    required={f.required}
                    format="+998 ## ### ## ##"
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    disabled={f.disabled}
                />
            )
        case "car_number":
            return (
                <FormCarNumber
                    required={f.required}
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    disabled={f.disabled}
                />
            )

        case "date":
            return (
                <FormDatePicker
                    required={f.required}
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    disabled={f.disabled}
                    calendarProps={f.calendarProps}
                />
            )
        case "select":
            return (
                <FormSelect
                    required={f.required}
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    options={f.options || []}
                    disabled={f.disabled}
                    valueKey={f.returnVal}
                />
            )
        case "img":
            return (
                <FormImagePicker
                    required={f.required}
                    key={f.name}
                    methods={form}
                    name={f.name}
                    label={f.label}
                    disabled={f.disabled}
                    className={f.className}
                    avatar
                />
            )
        case "slider":
            return (
                <FormSlider
                    required={f.required}
                    key={f.name}
                    control={form.control}
                    name={f.name}
                    label={f.label}
                    {...f.sliderProps}
                />
            )
        case null:
            return null
        default:
            return (
                <FormInput
                    required={f.required}
                    key={f.name}
                    methods={form}
                    name={f.name}
                    label={f.label}
                    placeholder={f.placeholder}
                    disabled={f.disabled}
                />
            )
    }
}
