import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { TrendIconProps } from './types';

const PATHS = {
  up: 'M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7L342.6 374.6c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z',
  down: 'M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 82.7L342.6 137.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352 384 352z',
};

// Font Awesome Free 6 "arrow-trend-up"/"arrow-trend-down" solid (CC BY 4.0) — https://fontawesome.com/icons/arrow-trend-up
export const TrendIcon: React.FC<TrendIconProps> = ({ direction, size = 20, color = '#000' }) => {
  return (
    <Svg width={size} height={size * (512 / 576)} viewBox="0 0 576 512" fill={color}>
      <Path d={PATHS[direction]} />
    </Svg>
  );
};
