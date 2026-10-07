export class UrlBuilder {
  static resolveWithPort(baseUrl: string, port: number | string) {
    try {
      const url = new URL(baseUrl);

      if (url.port || !port) return url.origin;

      url.port = port.toString().replace(/^:/, '');
      return url.origin;
    } catch (e) {
      console.error('Invalid base URL:', baseUrl, e);
      return baseUrl;
    }
  }
}
