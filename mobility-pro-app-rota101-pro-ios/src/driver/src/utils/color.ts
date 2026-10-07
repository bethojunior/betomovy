export const transformColorInHex = (color: string) => {
  let hex = color.replace('#', '');

  if(hex.length === 6) return color;

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  return `#${hex}`;
}