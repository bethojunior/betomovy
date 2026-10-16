import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { AccountInfo } from '../../../../context/bank/types';

export interface AccountNumbersSectionProps {
  form: AccountInfo;
  editable: boolean;
  onChangeField: (key: keyof AccountInfo, value: string) => void;
  onFocusField: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}
