function formatPassportNumber(passport: string | number): string {
    const passportStr = String(passport);
    const formattedPassport = passportStr.replace(/^([A-Z]{2})(\d{7})$/, '$1 $2');
    return formattedPassport;
}
export default formatPassportNumber