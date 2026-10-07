export const CharLimited = (
  value: string | undefined,
  numberChar: number
): string => {
  if (value == null || value === "") {
    return "";
  }
  const limit = Math.max(0, numberChar);
  if (value.length <= limit) {
    return value;
  }
  return `${value.substring(0, limit)}...`;
};
