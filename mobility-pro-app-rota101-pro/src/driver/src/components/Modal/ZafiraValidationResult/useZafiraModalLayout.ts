import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { MODAL_SIZE, SPACING_BASE, BASE_WIDTH } from './constants';

export interface ZafiraModalLayout {
  /** Screen dimensions */
  screen: { width: number; height: number };
  /** Scale factor (screenWidth / BASE_WIDTH), capped */
  scale: number;
  /** Modal content dimensions */
  modal: { width: number; minHeight: number };
  /** Responsive padding (horizontal, vertical) */
  padding: { horizontal: number; vertical: number };
  /** Icon and logo sizes */
  icon: {
    status: number;
    statusContainer: number;
    logoW: number;
    logoH: number;
    detail: number;
    detailContainer: number;
    footer: number;
  };
  /** Typography - font sizes (responsive) */
  typography: { title: number; subtitle: number; body: number; caption: number; label: number; footer: number };
  /** Spacing scale (responsive, px) */
  spacing: Record<keyof typeof SPACING_BASE, number>;
  /** Border radius (responsive, px) */
  radius: number;
}

export function useZafiraModalLayout(): ZafiraModalLayout {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  return useMemo(() => {
    const scale = Math.min(Math.max(screenWidth / BASE_WIDTH, 0.85), 1.15);
    const modalWidth = screenWidth * MODAL_SIZE.widthPercent;
    const minHeight = screenHeight * MODAL_SIZE.minHeightPercent;

    const spacing = {
      xs: Math.round(SPACING_BASE.xs * scale),
      sm: Math.round(SPACING_BASE.sm * scale),
      md: Math.round(SPACING_BASE.md * scale),
      lg: Math.round(SPACING_BASE.lg * scale),
      xl: Math.round(SPACING_BASE.xl * scale),
      xxl: Math.round(SPACING_BASE.xxl * scale),
    };

    return {
      screen: { width: screenWidth, height: screenHeight },
      scale,
      modal: { width: modalWidth, minHeight },
      padding: {
        horizontal: Math.round(screenWidth * 0.04),
        vertical: Math.round(screenHeight * 0.012),
      },
      icon: {
        status: RFValue(21),
        statusContainer: Math.round(42 * scale),
        logoW: Math.round(Math.max(screenWidth * 0.28, 96 * scale)),
        logoH: Math.round(Math.max(screenWidth * 0.14, 46 * scale)),
        detail: RFValue(14),
        detailContainer: Math.round(27 * scale),
        footer: RFValue(11),
      },
      typography: {
        title: RFValue(16.5),
        subtitle: RFValue(12),
        body: RFValue(13.5),
        caption: RFValue(12),
        label: RFValue(10.5),
        footer: RFValue(10),
      },
      spacing,
      radius: Math.round(8 * scale),
    };
  }, [screenWidth, screenHeight]);
}
