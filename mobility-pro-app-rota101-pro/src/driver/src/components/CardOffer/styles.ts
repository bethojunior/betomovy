import {shade} from 'polished';
import {Button} from 'react-native-paper';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: column;
  padding: ${({theme}) => theme.spacing.xlarge}px;
  margin: ${({theme}) => theme.spacing.medium}px ${({theme}) => theme.spacing.large}px;
  border-radius: 16px;
  background-color: ${({theme}) => theme.colors.white};
  border-width: 1px;
  border-color: #E2E8F0;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 8px;
  elevation: 4;
`;
export const ContainerHeader = styled.View`
  flex-direction: column;
`;
export const TextDescription = styled.Text<{color?: string}>`
  color: ${({theme, color}) => color || theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: 'MavenPro_500Medium';
`;
export const TextValue = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
`;
export const Footer = styled.View`
  flex-direction: column;
  justify-content: space-between;
`;

export const ContainerRowFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;

export const ContainerCancel = styled.View`
  margin-left: auto;
`;

export const ButtonCancel = styled(Button)``;

export const ButtonAction = styled.TouchableOpacity<{bg: string, isDisable: boolean}>`
  background-color: ${({bg, theme}) => bg || theme.colors.brand_blue || theme.colors.primary};
  padding: ${({theme}) => theme.spacing.medium}px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 48px;
  margin-right: ${({theme}) => theme.spacing.small}px;
  opacity: ${({isDisable}) => isDisable ? 0.6 : 1};
`;

export const TextCancel = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
`;

export const AddressContent = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 20px 10px 20px 0;
  margin-top: 10px;
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
  border-top-width: 0.5px;
  border-top-color: ${({theme}) => theme.colors.primary};
`;

export const Ball = styled.View<any>`
  background-color: ${({theme, color}) =>
    color === 'primary' ? theme.colors.primary : theme.colors.secondary};
  border-radius: 100px;
  width: 10px;
  height: 10px;
  align-self: center;
`;

export const Square = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  width: 10px;
  height: 10px;
  align-self: center;
`;

export const Line = styled.View`
  border-width: 0.8px;
  border-color: ${({theme}) => theme.colors.primary};
  flex: 1;
  width: 1px;
  align-self: center;
  border-style: dashed;
  min-height: 20px;
`;

export const Address = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  margin-bottom: 10px;
  font-family: 'MavenPro_500Medium';
`;

export const Destiny = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: 'MavenPro_500Medium';
`;
