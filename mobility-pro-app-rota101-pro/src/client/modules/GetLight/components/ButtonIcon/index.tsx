import Ionicons from '@expo/vector-icons/Ionicons';
import {ButtonSend} from '../ModalChat/styles';

interface Props {
  icon: JSX.Element;
  onPress: () => void;
}

export const ButtonIcon = ({icon, onPress}: Props) => {
  return (
    <ButtonSend onPress={onPress} activeOpacity={0.8}>
      {icon}
    </ButtonSend>
  );
};
