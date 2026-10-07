import {Container, Label} from './styles';

interface InputProps {
  label?: string;
  children: any;
  color?: string;
}

export function InputContainer({
  label,
  children,
  color,
}: InputProps): JSX.Element {
  return (
    <Container>
      <Label color={color}>{label}</Label>
      {children}
    </Container>
  );
}
