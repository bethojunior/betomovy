import { useTheme } from 'styled-components';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Item, ItemRow } from './styles';

interface SwitchProps {
  title?: string;
  titleSize?: "small" | "medium" | "large";
  checked: boolean;
  colorText?: string;
  onCheck: () => void;
  flex?: number;
}

export function CheckBox({ title, checked, onCheck, colorText, flex, titleSize }: SwitchProps) {
  const { colors } = useTheme();

  return (
    <ItemRow flex={flex}>
      <Item
        flex={flex}
        ellipsizeMode='tail'
        numberOfLines={1}
        textColor={colorText}
        onPress={onCheck}
        titleSize={titleSize}
      >
        {title}
      </Item>
      {checked ? (
        <MaterialIcons
          name="check-box"
          size={25}
          color={colorText ? colorText : colors.primary}
          onPress={onCheck}
        />
      ) : (
        <MaterialIcons
          name="check-box-outline-blank"
          size={25}
          color={colorText ? colorText : colors.primary}
          onPress={onCheck}
        />
      )}
    </ItemRow>
  );
}
