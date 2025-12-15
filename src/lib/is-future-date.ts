export function isFutureDate(dateString: string) {
    const inputDate = new Date(dateString);
    const today = new Date();
    
    return inputDate > today;
}