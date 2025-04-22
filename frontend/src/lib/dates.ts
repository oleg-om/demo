export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Месяц начинается с 0, поэтому прибавляем 1
  const day = String(d.getDate()).padStart(2, "0"); // Добавляем 0 перед числом, если оно одноцифровое

  return `${year}.${month}.${day}`;
}
