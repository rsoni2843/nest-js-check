export function formatDateString(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', {
    timeZone: 'Asia/Kolkata',
    month: 'short',
  });
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}${month}${year}_${
    Number(hours) <= 12 ? hours : Number(hours) - 12
  }:${minutes}:${seconds}_${Number(hours) <= 12 ? 'AM' : 'PM'}`;
}
