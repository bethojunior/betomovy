import {Container} from './styles';

interface Props {
  icon: JSX.Element;
  onPress?: () => void;
  disabled?: boolean;
}

export const ContainerIcon = ({icon, onPress, disabled}: Props) => {
  return (
    <Container onPress={onPress} disabled={disabled}>
      {icon}
    </Container>
  );
};
