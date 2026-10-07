interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export const useShadeColor = (percentage: number, color: string): string => {
  const hexToRgb = (hex: string): RGBColor => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  });

  const rgbToHex = (rgb: RGBColor): string =>
    `#${((1 << 24) | (rgb.r << 16) | (rgb.g << 8) | rgb.b)
      .toString(16)
      .slice(1)}`;

  const originalRgb: RGBColor = hexToRgb(color);

  const diffRgb: RGBColor = {
    r: Math.round(originalRgb.r * percentage),
    g: Math.round(originalRgb.g * percentage),
    b: Math.round(originalRgb.b * percentage),
  };

  const newRgb: RGBColor = {
    r: originalRgb.r - diffRgb.r,
    g: originalRgb.g - diffRgb.g,
    b: originalRgb.b - diffRgb.b,
  };

  const clampedRgb: RGBColor = {
    r: Math.max(0, Math.min(255, newRgb.r)),
    g: Math.max(0, Math.min(255, newRgb.g)),
    b: Math.max(0, Math.min(255, newRgb.b)),
  };

  const newColor: string = rgbToHex(clampedRgb);

  return newColor;
};
