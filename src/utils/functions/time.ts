export const formatDate = (dateString: string): string => {
  try {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return 'Invalid Date';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error';
  }
};
export const formatDateTime = (dateString: string): string => {
  try {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return 'Invalid Date';

    // Format the date (day, month, year)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Format the time (hours, minutes, seconds)
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Combine the date and time into a single formatted string
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error';
  }
};
export const formatTime = (timeString: string): string => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Initialize an array to hold the readable parts
  const parts: string[] = [];

  // Format the hours part
  if (hours > 0) {
    parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  }

  // Format the minutes part
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  }

  // Format the seconds part
  if (seconds > 0) {
    parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
  }

  // If all parts are zero, return "0 hour"
  if (parts.length === 0) {
    return "0 hour";
  }

  // Join the parts with " and " for readability
  return parts.join(' and ');
}
