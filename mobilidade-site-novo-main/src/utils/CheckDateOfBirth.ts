const MIN_BIRTH_YEAR = 1900;

export const isValidDateOfBirth = (value: string): boolean => {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const [, dayStr, monthStr, yearStr] = match;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);

  if (year < MIN_BIRTH_YEAR) return false;

  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isRealDate && date <= new Date();
};

export const toIsoDateOfBirth = (value: string): string => {
  if (!isValidDateOfBirth(value)) return "";

  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
};
