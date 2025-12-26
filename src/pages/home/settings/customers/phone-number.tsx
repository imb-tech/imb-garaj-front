export const formatPhoneNumber = (phone: string): string => {
    if (!phone) return "-";
    
    const digits = phone.replace(/\D/g, '');
    let cleanDigits = digits.startsWith('998') ? digits.substring(3) : digits;
    if (cleanDigits.length !== 9) return phone;
    return `+998 ${cleanDigits.substring(0, 2)} ${cleanDigits.substring(2, 5)} ${cleanDigits.substring(5, 7)} ${cleanDigits.substring(7, 9)}`;
};