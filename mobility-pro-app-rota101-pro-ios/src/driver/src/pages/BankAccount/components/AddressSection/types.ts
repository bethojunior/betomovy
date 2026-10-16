import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { AccountInfo } from '../../../../context/bank/types';

export interface AddressSectionProps {
  form: AccountInfo;
  editable: boolean;
  onChangeField: (key: keyof AccountInfo, value: string) => void;
  onBlurZipCode: (zipCode?: string) => void;
  onFocusField: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}
