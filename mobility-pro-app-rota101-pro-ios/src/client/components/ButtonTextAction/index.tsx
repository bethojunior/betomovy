import theme from '../../styles/theme';
import {TextEdit} from '../TextEdit';
import {ButtonText} from './style';
interface Props {
  text: string;
  onPress: () => void;
  icon?: React.ReactElement;
}

export const ButtonTextAction = ({onPress, text, icon}: Props) => {
  return (
    <ButtonText onPress={onPress}>
      {icon || null}
      <TextEdit color={theme.colors.primary}>{text}</TextEdit>
    </ButtonText>
  );
};
