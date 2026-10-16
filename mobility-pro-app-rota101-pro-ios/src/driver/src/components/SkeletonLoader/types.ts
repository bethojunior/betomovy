import { ViewStyle } from 'react-native';

export interface BlockProps {
  width?: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export interface SkeletonAddressSuggestionsProps {
  rows?: number;
}
