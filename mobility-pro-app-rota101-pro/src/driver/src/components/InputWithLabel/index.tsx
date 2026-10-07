import theme from '../../styles/theme';
import {TextEdit} from '../TextEdit';
import {ContentInput, InputAddress} from './styles';
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from 'react-native';

interface Props {
  value: string;
  onChange: (text: string) => void;
  title: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  returnKeyType?: ReturnKeyTypeOptions;
}

export const InputWithLabel = ({
  value,
  onChange,
  title,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  returnKeyType = 'done',
}: Props) => {
  return (
    <ContentInput>
      <TextEdit size="medium" color={theme.colors.secondary}>
        {title}
      </TextEdit>
      <InputAddress
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
      />
    </ContentInput>
  );
};
