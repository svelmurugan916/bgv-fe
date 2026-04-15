import { parseISO, format, isValid } from 'date-fns';

export const formatToISO = (dateStr) => {
    if (!dateStr || !dateStr.includes('/')) return dateStr;
    // Converts DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
};

export const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // Splits "2023-05-14T18:30:00..." at 'T' and takes the first part "2023-05-14"
    return dateString.split("T")[0];
};

export const formatFullDateTime = (dateString) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);

    // Returns format: 25 Jan 2026, 06:32 PM
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export const formatDate = (date) => {
    if (!date) return 'NA';
    return new Date(date)
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        .replace(' ', ', ');
}


export const isDateMatch = (dateA, dateB) => {
    if (!dateA || !dateB) return false;

    const normalize = (d) => {
        try {
            // 1. Create a Date object (handles ISO, Timestamps, and standard strings)
            const dateObj = new Date(d);

            // 2. Check if the date is actually valid
            if (!isValid(dateObj)) return null;

            // 3. Return a standardized string (Year-Month-Day only)
            return format(dateObj, 'yyyy-MM-dd');
        } catch (e) {
            return null;
        }
    };

    const cleanA = normalize(dateA);
    const cleanB = normalize(dateB);

    // If either is invalid, we can't confirm a match
    if (!cleanA || !cleanB) return false;

    return cleanA === cleanB;
};
