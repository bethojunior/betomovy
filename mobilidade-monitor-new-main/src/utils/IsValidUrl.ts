export const isValidURL = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);

    // Validar protocolo HTTP/HTTPS
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return false;
    }

    // Validar hostname
    const hostnameParts = url.hostname.split('.');
    if (hostnameParts.length < 2 || url.hostname.endsWith('-')) {
        return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};