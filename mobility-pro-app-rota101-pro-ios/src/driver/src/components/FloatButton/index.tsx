import { JSX } from 'react';
import {ButtonFloatContainer} from './styles';
interface Props {
  onPress?: () => void;
  icon?: JSX.Element;
  backgrounColorButton?: string;
  ref?: any;
}
export const FloatButton = ({
  icon,
  onPress,
  backgrounColorButton,
  ref,
}: Props) => {
  return (
    <ButtonFloatContainer
      activeOpacity={0.7}
      onPress={onPress}
      backgroundColor={backgrounColorButton}
      ref={ref}
    >
      {icon}
    </ButtonFloatContainer>
  );
};
