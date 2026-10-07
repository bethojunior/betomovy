export const decodeBase64 = (encodedString: string): string | null => {
  try {
    return atob(encodedString);
  } catch {
    return null;
  }
};
