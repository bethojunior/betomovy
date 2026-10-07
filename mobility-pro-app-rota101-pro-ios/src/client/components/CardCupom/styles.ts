import {lighten, shade} from 'polished';
import styled from 'styled-components/native';

interface PropsCard {
  disabled?: boolean;
}

export const ContainerCard = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin-top: ${({theme}) => theme.spacing.large}px;
`;

export const Content = styled.View<PropsCard>`
  flex-direction: row;
  flex: 1;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.xlarge}px
    ${({theme}) => theme.spacing.xsslarge}px;
  border-radius: ${({theme}) => theme.spacing.medium}px;
  background-color: ${({theme, disabled}) =>
    !disabled
      ? shade(0.1, theme.colors.primary)
      : lighten(0.5, theme.colors.primary)};
`;

export const CupomData = styled.View`
  flex-direction: column;
`;

export const ContainerTag = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PriceCupon = styled.Text`
  text-align: right;
  color: ${({theme}) => theme.colors.background_global};
`;

export const Image = styled.Image`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;
