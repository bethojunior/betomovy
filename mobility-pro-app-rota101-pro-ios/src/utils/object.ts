export const hasObjectValue = (value: unknown): boolean => {
  return typeof value === 'object' && value && Object.keys(value).length > 0;
};
