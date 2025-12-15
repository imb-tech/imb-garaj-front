export const getIds = (
    data: { id: number }[],
    obj: { [key: number]: boolean },
) => {
    return data
        .filter((_, index) =>
            Object.keys(obj)
                .map((e) => +e)
                .includes(index),
        )
        .map((f) => f.id)
}
