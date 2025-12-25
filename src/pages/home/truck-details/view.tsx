import { ParamCombobox } from "@/components/as-params/combobox"
import ParamDateRange from "@/components/as-params/date-picker-range"
import ParamTabs from "@/components/as-params/tabs"
import { Button } from "@/components/ui/button"
import { useNavigate } from "@tanstack/react-router"
import TripOrderMain from "../trip-orders"
import { months, optionYears } from "./filter"
import HrProfile from "./truck-profile"
import VehicleCashflows from "./truck-profile/truck-cashflows"

function ViewPage({ data }: { data: Human | undefined }) {
    const navigate = useNavigate()
    const options = [
        {
            value: "0",
            label: "Reyslar",
            content: <TripOrderMain />,
        },

        {
            value: "6",
            label: "Boshqa xarajatlar",
            content: <VehicleCashflows />,
        },
    ]

    return (
        <div className="pb-4">
            <div className="flex items-center gap-3 mb-4">
                <Button
                    onClick={() => navigate({ to: "/truck" })}
                    className="shrink-0"
                >
                    Orqaga
                </Button>

                <div className="flex flex-1 justify-end items-center gap-3">
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
                            className:
                                "!bg-background dark:!bg-secondary min-w-32",
                        }}
                    />

                    <ParamDateRange
                        addButtonProps={{
                            className:
                                "!bg-background dark:!bg-secondary min-w-32 justify-start",
                        }}
                    />
                </div>
            </div>

            <HrProfile data={data} />
            <ParamTabs options={options} className="gap-1 mt-2" />
        </div>
    )
}

export default ViewPage
