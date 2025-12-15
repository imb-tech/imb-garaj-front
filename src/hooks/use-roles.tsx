import { useMemo } from 'react'
import { useGet } from './useGet'
import { USERS_ROLES } from '@/constants/api-endpoints'
import { useSearch } from '@tanstack/react-router'

export default function useRoles() {
    const { data: dataPosition } = useGet<Position[]>(USERS_ROLES)

    const options = useMemo(() => {
        return dataPosition?.map(s => ({
            name: (`${s.company_name ?? ""}${s.company_name ? " -" : ""} ${s.department_name ?? ""}${s.department_name ? " -" : ""} ${s.name} `).trim(),
            id: s.id
        })) ?? []
    }, [dataPosition])

    return options
}

export function usePositions() {
    const search = useSearch({ strict: false })
    const { data } = useGet<Position[]>(USERS_ROLES, {
        params: { departments: Number(search?.departments ?? 0) > 0 ? search?.departments : undefined },
    })

    return data ?? []
}