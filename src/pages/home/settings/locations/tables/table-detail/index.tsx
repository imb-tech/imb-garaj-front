import DistrictsTable from "./districts"
import RegionsTable from "./regions"

interface CountriesDetailRow {
    country_id: number
}

export const CountriesDetailRow = ({ country_id }: CountriesDetailRow) => {
    return (
        <div className="py-3 px-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4  ">
                <RegionsTable country_id={country_id} />
                <DistrictsTable />
            </div>
        </div>
    )
}
