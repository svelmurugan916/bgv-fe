export const normalize = (val) => {
    if (!val) return "";
    return val
        .toString()
        .trim()
        .toUpperCase()
        .replace(/\s+/g, ' '); // Collapses multiple spaces into one
};