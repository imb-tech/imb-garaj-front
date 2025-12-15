export function getOverTime(d: OrderDispatchData) {
    if (
        d.time?.to_factory_time?.slice(0, 1) > "3" ||
        d.time?.loading_time?.slice(0, 1) > "3" ||
        d.time?.getting_location_time?.slice(0, 1) > "3"
    ) {
        return "text-red-800"
    } else if (
        d.time?.to_factory_time?.slice(0, 1) > "2" ||
        d.time?.loading_time?.slice(0, 1) > "2" ||
        d.time?.getting_location_time?.slice(0, 1) > "2"
    ) {
        return "text-red-500"
    } else if (
        d.time?.to_factory_time?.slice(0, 1) > "1" ||
        d.time?.loading_time?.slice(0, 1) > "1" ||
        d.time?.getting_location_time?.slice(0, 1) > "1"
    ) {
        return "text-yellow-600"
    } else {
        return "text-primary"
    }
}
