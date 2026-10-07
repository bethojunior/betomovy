import styled from 'styled-components/native';

export const ContainerPressable = styled.TouchableOpacity`
  width: 100%;
`;

export const Input = styled.TextInput.attrs(({theme}) => ({}))<{
  disabled;
  activeOpacity;
}>`
  background-color: ${({theme}) => theme.colors.background_white};
  width: 100%;
  padding: ${({theme}) => theme.spacing.medium}px;
  color: ${({theme, disabled}) =>
    disabled ? theme.colors.grayLight : theme.colors.black};
  border-radius: 5px;
  border: ${({activeOpacity}) => (activeOpacity ? '2px' : '1px')} solid
    ${({theme}) => theme.colors.primary};
`;
