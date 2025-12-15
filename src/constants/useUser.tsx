import { useGet } from "@/hooks/useGet"
import { USERS_ADMIN_PROFILE } from "./api-endpoints"

export const useUser = () => {
    const { data, ...other } = useGet<User>(USERS_ADMIN_PROFILE) 

    const user_info = {
        id: data?.id,
        username: data?.username,
        first_name: data?.first_name,
        last_name: data?.last_name,
        profile_photo: data?.profile_photo,
        phone_number: data?.phone_number,
        telegram_id: data?.telegram_id,
        role_name: data?.role_name,
        has_exam: data?.has_exam || false,
        bot_url: data?.bot_url
    }
    const manager_codes =
        data?.manager_codes
            ?.map((m) => ({ label: m, value: m }))
            ?.sort((a, b) => a.value - b.value) || []
    const agent_codes =
        data?.agent_codes
            ?.map((m) => ({ label: m, value: m }))
            ?.sort((a, b) => a.value - b.value) || []
    const modules = data?.modules
    const permissions = modules?.map((m) => m.key) || []

    return {
        user_info,
        manager_codes,
        agent_codes,
        modules,
        permissions,
        ...other,
    }
}
