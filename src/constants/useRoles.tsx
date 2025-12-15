import { useGet } from "@/hooks/useGet"

export const useRoles = () => {
    const { data: rolesData, isFetching: isRolesFetching } = useGet<Place[]>("user/role/")
    const roles = rolesData?.map((r) => ({ ...r, label: r.name, value: r.id })) || []

    return { roles, isRolesFetching }
}
