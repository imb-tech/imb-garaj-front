import { useGet } from "@/hooks/useGet"
import { CLIENT_CODES } from "./api-endpoints"

export const useCodes = () => {
    const { data: codesData, isLoading } =
        useGet<{ code: number; id: number }[]>(CLIENT_CODES)
    const codes =
        codesData
            ?.sort((a, b) => a.code - b.code)
            ?.map((f) => ({ label: f.code, value: f.id })) || []

    return { codes, isLoading }
}
