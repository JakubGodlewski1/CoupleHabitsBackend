export function isValidDate(dateString: string): boolean {
    // Adjusted regex to optionally match the part in parentheses
    const regex = /^[A-Za-z]{3} [A-Za-z]{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4}( \(.+\))?$/;

    return regex.test(dateString);
}