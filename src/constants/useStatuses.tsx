export const statuss = [
    {
        label: "Start",
        value: 50,
    },
    {
        label: "Navbatda",
        value: 60,
    },
    {
        label: "Yuklanmoqda...",
        value: 70,
    },
    {
        label: "Yuklab chiqdi",
        value: 80,
    },
    {
        label: "Yuk tushirish joyida",
        value: 90,
    },
    {
        label: "Finish",
        value: 100,
    },
]

export const statussAll = [
    {
        label: "Barchasi", 
        value: 0,
    },
    {
        label: "Start",
        value: 50,
    },
    {
        label: "Navbatda",
        value: 60,
    },
    {
        label: "Yuklanmoqda...",
        value: 70,
    },
    {
        label: "Yuklab chiqdi",
        value: 80,
    },
    {
        label: "Yuk tushirish joyida",
        value: 90,
    },
    {
        label: "Finish",
        value: 100,
    },
]

export const statusLabel: { [key: number]: string } = {
    0: "Barchasi",
    50: "Start",
    60: "Navbatda",
    70: "Yuklanmoqda...",
    80: "Yuklab chiqdi",
    90: "Yuk tushirish joyida",
    100: "Finish",
}

interface UseStatusesProps {
    all?: boolean
    start?: boolean
    finish?: boolean
    from?: number
    onlyNext?: boolean
}

export const useStatuses = (props?: UseStatusesProps) => {
    let filteredStatuses = [...statuss]

    if (props?.all === false) {
        filteredStatuses = filteredStatuses.filter(
            (status) => status.value !== 40,
        )
    }

    if (props?.start === false) {
        filteredStatuses = filteredStatuses.filter(
            (status) => status.value !== 50,
        )
    }

    if (props?.finish === false) {
        filteredStatuses = filteredStatuses.filter(
            (status) => status.value !== 100,
        )
    }

    if (props?.from) {
        const startIndex = filteredStatuses.findIndex(
            (status) => status.value === props.from,
        )
        if (startIndex !== -1) {
            filteredStatuses = filteredStatuses.slice(
                startIndex + 1,
                props.onlyNext ? startIndex + 2 : undefined,
            )
        } else {
            filteredStatuses = []
        }
    }

    return filteredStatuses
}
