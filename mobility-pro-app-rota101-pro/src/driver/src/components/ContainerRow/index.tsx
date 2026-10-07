import { ViewProps } from 'react-native';
import {Container, Content} from './styles';
import { JSX } from 'react';

interface Props {
  title: JSX.Element;
  description: JSX.Element;
}
export const ContainerRow = ({title, description, ...rest}: Props & ViewProps) => {
  return (
    <Container
    {...rest}
    >
      {title}
      <Content>{description}</Content>
    </Container>
  );
};
