export const transformColorInHex = (color: string) => {
  if (!color) return '#000000';
  let hex = color
    .replace('#', '')
    .replace(/[\s\n\r\t]/g, '')
    .trim();

  if (!hex || hex.length === 0) return '#000000';

  if (hex.length === 6) return `#${hex}`;

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  return `#${hex}`;
}