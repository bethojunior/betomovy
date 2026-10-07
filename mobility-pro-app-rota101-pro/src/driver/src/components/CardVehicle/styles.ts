import {lighten} from 'polished';
import styled from 'styled-components/native';

interface PropsInput {
  editable?: boolean;
}

export const ContainerCard = styled.View`
  width: 100%;
  flex-direction: column;
  padding: ${({theme}) => theme.spacing.large}px;
`;

export const TextDescription = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-family: ${({theme}) => theme.fonts.regular};
  margin-bottom: ${({theme}) => theme.spacing.small}px;
  color: ${({theme}) => lighten(0.3, theme.colors.secondary)};
`;

export const TextTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;

export const Input = styled.TextInput<PropsInput>`
  width: 100%;
  border: 0.5px solid
    ${({theme, editable}) => (editable ? theme.colors.primary : 'transparent')};
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  padding: ${({theme}) => theme.spacing.medium}px;
  border-radius: ${({theme, editable}) =>
    editable ? theme.borderRadius.small : 0}px;
  color: ${({theme}) => theme.colors.secondary}
`;
