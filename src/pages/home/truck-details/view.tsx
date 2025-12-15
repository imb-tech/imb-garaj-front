import ParamTabs from "@/components/as-params/tabs"
import HrProfile from "./truck-profile"

import { ParamCombobox } from "@/components/as-params/combobox"
import ParamDateRange from "@/components/as-params/date-picker-range"
import { months, optionYears } from "./filter"
import TruckMap from "./truck-profile/map"
import { TruckTabsFour } from "./truck-profile/truck-tabs-four"
import { TruckTabsOne } from "./truck-profile/truck-tabs-one"
import { TruckTabsOneClone } from "./truck-profile/truck-tabs-one-clone"
import { TruckTabsTwo } from "./truck-profile/truck-tabs-two"

function ViewPage({ data }: { data: Human | undefined }) {
    
    const options = [
        {
            value: "0",
            label: "Reyslar",
            content: <TruckTabsOne />,
        },
        {
            value: "1",
            label: "Bo'sh  Reyslar",
            content: <TruckTabsOneClone />,
        },
        { value: "6", label: "Boshqa xarajatlar", content: <TruckTabsTwo /> },
        {
            value: "4",
            label: "Texnik Statistika ",
            content: <TruckTabsFour />,
        },
        { value: "5", label: "Monitoring", content: <TruckMap /> },
    ]

    return (
        <div className="pb-4">
            <div className="flex justify-end items-center gap-3 mb-4">
                <ParamCombobox
                    paramName="truck_number"
                    options={months}
                    isSearch={false}
                    valueKey="key"
                    labelKey="name"
                    label="Haydovchilar"
                    className="w-full"
                    addButtonProps={{
                        className: "!bg-background dark:!bg-secondary",
                    }}
                />

                <ParamCombobox
                    paramName="truck_number"
                    options={months}
                    isSearch={false}
                    valueKey="key"
                    labelKey="name"
                    label="Transportlar"
                    className="w-full"
                    addButtonProps={{
                        className: "!bg-background dark:!bg-secondary",
                    }}
                />

                <ParamCombobox
                    paramName="month"
                    options={months}
                    isSearch={false}
                    valueKey="key"
                    labelKey="name"
                    label="Oy"
                    className="w-full"
                    addButtonProps={{
                        className: "!bg-background dark:!bg-secondary",
                    }}
                    asloClear={["start_date", "end_date"]}
                />
                <ParamCombobox
                    paramName="year"
                    options={optionYears()}
                    isSearch={false}
                    asloClear={["start_date", "end_date"]}
                    label="Yil"
                    className="w-full"
                    addButtonProps={{
                        className: "!bg-background dark:!bg-secondary min-w-32",
                    }}
                />

                <ParamDateRange
                    addButtonProps={{
                        className:
                            "!bg-background dark:!bg-secondary min-w-32 justify-start",
                    }}
                />
            </div>
            <HrProfile data={data} />
            <ParamTabs options={options} className="gap-1 mt-2" />
        </div>
    )
}

export default ViewPage
