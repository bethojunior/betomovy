import {View} from 'react-native';

import {ContainerPressable, Input} from './styles';
import {translate} from '../../locales';

interface Props {
  placeholder?: string;
  value: string;
  onPress: () => void;
  disabled?: boolean;
  activeOpacity?: boolean;
}

function InputAddress({
  value,
  onPress,
  placeholder = translate('trip.input_address_placeholder_text'),
  disabled,
  activeOpacity,
}: Props) {
  const addressFormatted = (address: string) => {
    if (address && address.length > 40) {
      return `${address.substring(0, 45)}...`;
    }
    return value;
  };
  return (
    <ContainerPressable onPress={onPress}>
      <View
        pointerEvents={disabled ? 'box-none' : 'none'}
        style={{
          marginBottom: 12,
        }}
      >
        <Input
          activeOpacity={activeOpacity}
          value={addressFormatted(value)}
          placeholder={placeholder}
          editable={false}
          disabled={disabled || false}
        />
      </View>
    </ContainerPressable>
  );
}

export default InputAddress;
