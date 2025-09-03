/**
 * Parses a "YYYY-MM-DD" string into a Date object, interpreting it as local time.
 * This is to avoid issues where `new Date('YYYY-MM-DD')` is parsed as UTC midnight,
 * which can result in the previous day in timezones behind UTC.
 * @param dateString The date string in "YYYY-MM-DD" format.
 * @returns A Date object set to midnight in the local timezone.
 */
export const parseDateString = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

/**
 * Formats a Date object into a "YYYY-MM-DD" string.
 * @param date The Date object to format.
 * @returns A "YYYY-MM-DD" string.
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
