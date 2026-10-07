import { ReactNode } from 'react';
import { KeyboardTypeOptions, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';

export interface FormFieldRowProps {
  label: string;
  value?: string;
  editable: boolean;
  required?: boolean;
  keyboardType?: KeyboardTypeOptions;
  icon?: ReactNode;
  error?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}
