import { SETTINGS_DISTRICTS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { useNavigate } from "@tanstack/react-router"

interface CountriesDetailRow {
    countries: RolesType
}

export const CountriesDetailRow = ({ countries }: CountriesDetailRow) => {
    const navigate = useNavigate()
    // const search = useSearch({ from: "/_main/_settings/locations/" })
    const { data } = useGet<ListResponse<RolesType>>(
        `${SETTINGS_DISTRICTS}/${countries.id}`,
        {
            enabled: !!countries.id,
        },
    )

    // useEffect(() => {
    //     if (data?.results.length) {
    //         const orderUuid = data?.results?.[0]?.id
    //         navigate({
    //             to: "/locations",
    //             search: { ...search, country:  },
    //         })
    //     }
    // }, [data])

    return (
        <div className="py-3 px-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  ">
                {/* <LeftSideCars />
                <RightSideCars /> */}
            </div>
        </div>
    )
}
