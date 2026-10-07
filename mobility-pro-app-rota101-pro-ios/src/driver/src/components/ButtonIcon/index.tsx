import Ionicons from '@expo/vector-icons/Ionicons';
import {ButtonSend} from './styles';

interface Props {
  icon: JSX.Element;
  onPress: () => void;
  w?: number;
  h?: number;
}

export const ButtonIcon = ({icon, onPress, w, h}: Props) => {
  return (
    <ButtonSend
      style={{
        width: w ? w : 35,
        height: h ? h : 35,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
    </ButtonSend>
  );
};
