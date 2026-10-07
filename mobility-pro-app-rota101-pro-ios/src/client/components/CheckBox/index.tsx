import {useTheme} from 'styled-components';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {Item, ItemRow} from './styles';

interface SwitchProps {
  title?: string;
  checked: boolean;
  colorText?: string;
  onCheck: () => void;
}

export function CheckBox({title, checked, onCheck, colorText}: SwitchProps) {
  const {colors} = useTheme();

  return (
    <ItemRow>
      <Item onPress={onCheck} textColor={colorText}>
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
