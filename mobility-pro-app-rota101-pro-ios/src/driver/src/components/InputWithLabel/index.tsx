import theme from '../../styles/theme';
import {TextEdit} from '../TextEdit';
import {ContentInput, InputAddress} from './styles';

interface Props {
  value: string;
  onChange: (text: string) => void;
  title: string;
  placeholder?: string;
}

export const InputWithLabel = ({
  value,
  onChange,
  title,
  placeholder,
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
      />
    </ContentInput>
  );
};
