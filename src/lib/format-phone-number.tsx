export const formatPhoneNumber = (phoneNumberString: string) => {
    if (phoneNumberString) {
        return `${phoneNumberString.slice(0, 2)} ${phoneNumberString.slice(2, 5)} ${phoneNumberString.slice(5, 7)} ${phoneNumberString.slice(7)}`
    } else {
        return ""
    }
}
