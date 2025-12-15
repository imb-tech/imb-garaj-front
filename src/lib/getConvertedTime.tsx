export const getFormattedTime = (time: string) => {
    if (time) {
        const [total_seconds, _] = time.split(".");
        let seconds = parseInt(total_seconds, 10);

        const isNegative = seconds < 0;
        seconds = Math.abs(seconds);

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        seconds = seconds % 60;

        const formattedTime =
            (hours > 0 ? hours + ":" : "") +
            (hours > 0 && minutes < 10 ? "0" : "") +
            minutes +
            ":" +
            (seconds < 10 ? "0" : "") +
            seconds;

        return isNegative ? `-${formattedTime}` : formattedTime;
    } else {
        return "";
    }
};
