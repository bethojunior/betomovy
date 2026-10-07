import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { AccountInfo } from '../../../../context/bank/types';
import { FieldErrors } from '../../useBankAccountForm';

export interface RequiredSectionProps {
  form: AccountInfo;
  editable: boolean;
  fieldErrors: FieldErrors;
  onChangeField: (key: keyof AccountInfo, value: string) => void;
  onFocusField: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}
