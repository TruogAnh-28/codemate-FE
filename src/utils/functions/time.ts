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
