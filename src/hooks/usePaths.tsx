import { useLocation } from "@tanstack/react-router"
import { ListOrdered, Truck } from "lucide-react"
import { ReactNode, useMemo } from "react"

export interface MenuItem {
    label: string
    icon?: ReactNode
    path: string
    items?: MenuItem[]
}

const filterMenuItems = (
    items: MenuItem[],
    allowedModules: string[],
): MenuItem[] => {
    return items.reduce<MenuItem[]>((acc, item) => {
        const isModuleAllowed = allowedModules.includes(item.label)
        const hasVisibleSubItems = item.items?.some(
            (sub) =>
                allowedModules.includes(sub.label) ||
                sub.items?.some((subsub) =>
                    allowedModules.includes(subsub.label),
                ),
        )

        if (isModuleAllowed || hasVisibleSubItems) {
            const filteredItem: MenuItem = { ...item }

            if (item.items) {
                filteredItem.items = filterMenuItems(item.items, allowedModules)
            }

            acc.push(filteredItem)
        }

        return acc
    }, [])
}

const findChildPaths = (items: MenuItem[], currentPath: string): MenuItem[] => {
    for (const firstLevelItem of items) {
        if (!firstLevelItem.items) continue

        for (const secondLevelItem of firstLevelItem.items) {
            if (!secondLevelItem.items) continue

            for (const thirdLevelItem of secondLevelItem.items) {
                if (thirdLevelItem.path === currentPath) {
                    return secondLevelItem.items
                }
            }

            if (secondLevelItem.path === currentPath) {
                return secondLevelItem.items
            }
        }
    }

    return []
}

const getAllPaths = (filteredItems: MenuItem[]) =>
    filteredItems?.flatMap((item) =>
        item.items ? item.items.map((i) => i.path) : [item.path],
    ) || []

const getAllLabels = (items: MenuItem[]): string[] => {
    const result: string[] = []

    const traverse = (items: MenuItem[]) => {
        for (const item of items) {
            result.push(item.label)
            if (item.items?.length) {
                traverse(item.items)
            }
        }
    }

    traverse(items)
    return result
}

export const usePaths = () => {
    const pathname = useLocation().pathname

    const items = useItems()

    const allLabels = getAllLabels(items)

    const filteredItems = useMemo(
        () => filterMenuItems(items, allLabels),
        [items, allLabels],
    )

    const childPaths = useMemo(
        () => findChildPaths(filteredItems, pathname),
        [filteredItems, pathname],
    )

    const allPaths = useMemo(() => getAllPaths(filteredItems), [filteredItems])

    const addOrder = allLabels.includes("Buyurtmalar")

    return {
        childPaths,
        allPaths,
        addOrder,
        filteredItems,
    }
}

export const useItems = () =>
    useMemo<MenuItem[]>(
        () => [
            {
                label: "Bosh sahifa",
                icon: <ListOrdered width={18} />,
                path: "/dashboard",
            },
            {
                label: "Reyslar",
                icon: <Truck width={18} />,
                path: "/truck",
            },
              {
                label: "Transport Info",
                icon: <Truck width={18} />,
                path: "/transport",
            },
        ],
        [],
    )
