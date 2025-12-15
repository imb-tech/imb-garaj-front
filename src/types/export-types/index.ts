import { Path } from "react-hook-form"

export type FormType =
    | "phone_number"
    | "number"
    | "combobox"
    | "money"
    | "date"
    | "car_number"
    | "textfield"
    | "multi-combobox"
    | "select"
    | "img"
    | "slider"
    | null

export type FormField<Form = any> = {
    name: Path<Form>
    label: string
    placeholder?: string
    disabled?: boolean
    options?: { name: string | number; id: string | number }[]
    returnVal?: "id" | "name"
    type?: FormType
    required?:boolean
}
