import { useQueryClient } from "@tanstack/react-query"
import { buildQueryKey } from "./useGet"

type WithId = { id: string | number }

type PaginatedData<T extends WithId> = {
    results: T[]
    [key: string]: any
}

type UpdateQueryCacheOptions<T extends WithId> = {
    item: T | string | number
    isPaginated?: boolean
    insertAtStart?: boolean
    params?: Record<string, unknown>,
    url: string
}


export function useUpdateQueryCache<T extends WithId>() {
    const queryClient = useQueryClient()

    const addItemToQueryCache = ({
        item,
        url,
        params,
        isPaginated = true,
        insertAtStart = false
    }: UpdateQueryCacheOptions<T>) => {
        const queryKey = buildQueryKey(url, params)

        if (isPaginated) {
            queryClient.setQueryData<PaginatedData<T>>(queryKey, (oldData) => {
                if (!oldData) {
                    return {
                        results: [item as T],
                        count: 0,
                        total_pages: 0,
                    }
                }


                const alreadyExists = oldData?.results?.some((el) => el.id === (item as T).id)
                if (alreadyExists) return oldData

                const updatedResults = insertAtStart
                    ? [item as T, ...oldData?.results]
                    : [...oldData?.results, item as T]


                const newCount = Math.max(
                    0,
                    (oldData.count || oldData.results.length) + 1
                )
                console.log(newCount);

                const pageSize = oldData.page_size || updatedResults.length
                const totalPages = Math.ceil(newCount / pageSize)

                return {
                    ...oldData,
                    results: updatedResults,
                    count: newCount,
                    total_pages: totalPages,

                }
            })
        } else {
            queryClient.setQueryData<T[]>(queryKey, (oldData = []) => {
                const alreadyExists = oldData.some((el) => el.id === (item as T).id)
                if (alreadyExists) return oldData

                return [...oldData, item as T]
            })
        }
    }

    const updateItemInQueryCache = ({
        item,
        url,
        params,
        isPaginated = true
    }: UpdateQueryCacheOptions<T>) => {
        const queryKey = buildQueryKey(url, params)

        if (isPaginated) {
            queryClient.setQueryData<PaginatedData<T>>(queryKey, (oldData) => {
                if (!oldData) return oldData

                const updatedResults = oldData?.results?.map((el) =>
                    el.id === (item as T).id ? { ...el, ...(item as T) } : el
                )

                return {
                    ...oldData,
                    results: updatedResults
                }
            })
        } else {
            queryClient.setQueryData<T[]>(queryKey, (oldData = []) =>
                oldData.map((el) =>
                    el.id === (item as T).id ? { ...el, ...(item as T) } : el
                )
            )
        }
    }

    const removeItemFromQueryCache = ({
        item,
        url,
        params,
        isPaginated = true
    }: UpdateQueryCacheOptions<T>) => {
        const itemId = typeof item === "object" ? (item as T).id : item

        const queryKey = buildQueryKey(url, params)

        if (isPaginated) {
            queryClient.setQueryData<PaginatedData<T>>(queryKey, (oldData) => {
                if (!oldData) return oldData
                const filteredResults = oldData?.results?.filter(
                    (el) => el.id !== itemId
                )

                const newCount = Math.max(
                    0,
                    (oldData.count || oldData.results.length) - 1
                )
                const pageSize = oldData.page_size || filteredResults.length || 1
                const totalPages = Math.ceil(newCount / pageSize)

                return {
                    ...oldData,
                    results: filteredResults,
                    count: newCount,
                    total_pages: totalPages,
                }
            })
        } else {
            queryClient.setQueryData<T[]>(queryKey, (oldData = []) =>
                oldData.filter((el) => el.id !== itemId)
            )
        }
    }

    return {
        addItemToQueryCache,
        updateItemInQueryCache,
        removeItemFromQueryCache
    }
}
