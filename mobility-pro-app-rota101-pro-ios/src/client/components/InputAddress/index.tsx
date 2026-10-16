import { View } from 'react-native';
import { ContainerPressable, Input } from './styles';
import { translate } from '../../locales';
import { buildAddressFieldAccessibilityLabel } from '../../utils/trip-route-accessibility';

const ADDRESS_DISPLAY_THRESHOLD = 40;

type InputAddressProps = {
  placeholder?: string;
  value?: string;
  onPress: () => void;
  disabled?: boolean;
  activeOpacity?: boolean;
  semanticPrefix?: string;
};

function formatAddressForDisplay(value: string | null | undefined): string {
  const raw = value == null ? '' : String(value);
  if (raw.length > ADDRESS_DISPLAY_THRESHOLD) {
    return `${raw.substring(0, ADDRESS_DISPLAY_THRESHOLD)}...`;
  }
  return raw;
}

function InputAddress({
  value,
  onPress,
  placeholder = translate('trip.input_address_placeholder_text'),
  disabled,
  activeOpacity,
  semanticPrefix,
}: InputAddressProps) {
  const a11yPressableProps =
    semanticPrefix !== undefined
      ? {
          accessible: true as const,
          accessibilityLabel: buildAddressFieldAccessibilityLabel(
            semanticPrefix,
            value ?? '',
          ),
        }
      : {};

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <ContainerPressable onPress={handlePress} {...a11yPressableProps}>
      <View
        pointerEvents={disabled ? 'box-none' : 'none'}
        style={{
          marginBottom: 12,
        }}
      >
        <Input
          activeOpacity={activeOpacity}
          value={formatAddressForDisplay(value)}
          placeholder={placeholder}
          editable={false}
          disabled={disabled || false}
        />
      </View>
    </ContainerPressable>
  );
}

export default InputAddress;
