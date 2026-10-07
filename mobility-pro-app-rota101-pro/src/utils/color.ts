import { readableColor } from 'polished';

export const readableTextColor = (
  background: string,
  dark = '#1A1A1A',
  light = '#FFFFFF',
): string => readableColor(background, dark, light);
