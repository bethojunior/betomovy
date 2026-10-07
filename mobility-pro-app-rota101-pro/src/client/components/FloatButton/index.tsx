import {ButtonFloatContainer} from './styles';
interface Props {
  onPress?: () => void;
  icon?: JSX.Element;
}
export const FloatButton = ({icon, onPress}: Props) => {
  return (
    <ButtonFloatContainer activeOpacity={0.7} onPress={onPress}>
      {icon}
    </ButtonFloatContainer>
  );
};