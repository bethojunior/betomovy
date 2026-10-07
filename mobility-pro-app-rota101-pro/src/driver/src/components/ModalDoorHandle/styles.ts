import {Button} from 'react-native-paper';
import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 0 ${({theme}) => theme.spacing.medium}px;
  align-items: center;
  justify-content: center;
`;

export const Header = styled.View`
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.primary};

  padding: ${({theme}) => theme.spacing.small}px;
  width: 100%;
  align-items: center;

  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const TitleHeader = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xxlarge}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Footer = styled.View`
  border-top-width: 0.5px;
  border-top-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  width: 100%;
  padding: ${({theme}) => theme.spacing.medium}px;
`;

export const ButtonManual = styled(Button)`
  border: 1px solid ${({theme}) => theme.colors.primary};
  margin-top: ${({theme}) => theme.spacing.large}px;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const ContainerQrCode = styled.View`
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;
