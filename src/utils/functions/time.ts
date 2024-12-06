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
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const roundedMinutes = Math.round(minutes + seconds / 60);
  const finalHours = hours + Math.floor(roundedMinutes / 60);
  const finalMinutes = roundedMinutes % 60;
  return `${finalHours} hours and ${finalMinutes} minutes`;
}

export const formatStart_EndDate = (date: string): string => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}
