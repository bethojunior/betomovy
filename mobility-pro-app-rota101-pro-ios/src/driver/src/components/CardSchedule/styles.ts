import {shade} from 'polished';
import {Button} from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: column;
  padding: ${({theme}) => theme.spacing.large}px ${({theme}) => theme.spacing.small}px;
  margin: ${({theme}) => theme.spacing.medium}px 0;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  background-color: ${({theme}) => shade(0.05, theme.colors.background_global)};
`;
export const ContainerHeader = styled.View`
  flex-direction: column;
`;
export const TextDescription = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_600SemiBold;
`;
export const TextValue = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
`;
export const Footer = styled.View`
  flex-direction: column;
  justify-content: space-between;
  border-top-color: ${({theme}) => theme.colors.primary};
  border-top-width: 0.5px;
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const ContainerCancel = styled.View`
  margin-left: auto;
`;

export const ButtonCancel = styled(Button)``;

export const TextCancel = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: MavenPro_600SemiBold;
`;

export const Content = styled.View`
  flex-direction: row;
`;

export const ContentPhoto = styled.View`
  margin-right: ${({theme}) => theme.spacing.large}px;
`;

export const Photo = styled.Image`
  width: ${RFValue(75)}px;
  height: ${RFValue(75)}px;
  border-radius: ${RFValue(75)}px;
`

export const ContentTrip = styled.View`
  flex: 1;
`;

export const ContentItem = styled.View`
  margin: ${({theme}) => theme.spacing.small}px 0;
`
