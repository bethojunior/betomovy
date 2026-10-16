import {Ionicons} from '@expo/vector-icons';
import {StyleProp, ViewStyle} from 'react-native';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastVariant {
  titleKey: string;
  iconName: keyof typeof Ionicons.glyphMap;
  accentColor: string;
}

export interface CustomFlashMessageProps {
  message: {
    message?: string;
    description?: string;
    type?: ToastType;
  };
  style?: StyleProp<ViewStyle>;
}
