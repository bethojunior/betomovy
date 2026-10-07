import {Container} from './styles';

interface Props {
  children: any;
  onPress: any;
}

export function Accessory({children, onPress}: Props) {
  return (
    <Container onPress={onPress} activeOpacity={0.7}>
      {children}
    </Container>
  );
}
