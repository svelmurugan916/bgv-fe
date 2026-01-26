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