import { NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { AccountInfo } from '../../../../context/bank/types';
import { BankFormattedProps } from '../../useBankAccountForm';

export interface IdentitySectionProps {
  form: AccountInfo;
  editable: boolean;
  banks: BankFormattedProps[];
  onChangeField: (key: keyof AccountInfo, value: string) => void;
  onChangeBank: (id: string, name: string) => void;
  onFocusField: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}
