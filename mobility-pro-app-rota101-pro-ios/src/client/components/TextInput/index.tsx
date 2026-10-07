import {shade} from 'polished';
import {TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';

interface Props {
  w?: string;
  h?: string;
  bg?: string | any;
  placeholder?: string;
  onChangeFunction: (text: string) => void;
  value?: string;
}

export const TextInputTransfer = ({
  w,
  h,
  bg,
  placeholder,
  onChangeFunction,
  value,
}: Props) => {
  return (
    <TextInput
      style={{
        width: w ?? '100%',
        height: !h ? RFValue(40) : h,
        backgroundColor: !bg ? shade(0.08, theme.colors.background_global) : bg,
        borderRadius: 10,
        paddingHorizontal: RFValue(10),
        marginTop: RFValue(5),
      }}
      placeholderTextColor={theme.colors.grayLight}
      placeholder={placeholder ?? ''}
      theme={{
        colors: {
          primary: theme.colors.secondary,
          text: theme.colors.secondary,
          placeholder: theme.colors.grayLight,
        },
      }}
      onChangeText={onChangeFunction}
      value={value}
    />
  );
};
