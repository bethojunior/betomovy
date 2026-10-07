import {MotiView} from 'moti';
import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ButtonProps {
  disabled?: boolean;
}

export const Container = styled.View`
  height: auto;
  padding-left: ${RFValue(20)}px;
  padding-bottom: ${RFValue(25)}px;
  padding-right: ${RFValue(20)}px;
  z-index: 1;
  width: 100%;
  background-color: ${({theme}) => theme.colors.background_global};
  border-top-left-radius: ${RFValue(25)}px;
  border-top-right-radius: ${RFValue(25)}px;
  position: absolute;
  bottom: 0;

  elevation: 5;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px -3px;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`;

export const Header = styled.View`
  padding-top: ${({theme}) => theme.spacing.large}px;
  padding-bottom: ${({theme}) => theme.spacing.small}px;
  flex-direction: row;
  justify-content: flex-start;
  margin-left: -5px;
  margin-bottom: ${({theme}) => theme.spacing.small}px;
  align-items: center;
  position: relative;
  min-height: ${() => RFValue(30)}px;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const InfoButton = styled.Text`
  position: absolute;
  right: ${() => RFValue(10)}px;
  top: 50%;
`;

export const BackPage = styled.TouchableOpacity`
  margin-right: ${RFValue(5)}px;
`;

export const ContentTaximeter = styled.View`
  padding: ${({theme}) => theme.spacing.medium}px;
  margin-top: ${({theme}) => theme.spacing.small}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 5px;

  align-items: center;
  justify-content: center;
`;

export const ContentPrice = styled.View`
  flex-direction: row;
`;

export const TextPrice = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${({theme}) => theme.fontSizes.xslarge}px;
  color: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.View`
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const Border = styled.View`
  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.primary};
`;

export const TextTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.secondary};
  width: 100%;

  padding: ${({theme}) => theme.spacing.small}px 0;
`;

export const ContainerButton = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${({theme, disabled}) =>
    disabled ? shade(0.4, theme.colors.primary) : theme.colors.primary};
  border-radius: 5px;
  padding: ${({theme}) => theme.spacing.medium}px;

  align-items: center;
  justify-content: center;
  width: 30%;
`;

export const ContentTime = styled.View`
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const ContainerCenter = styled.View``;

export const ContainerIcon = styled.TouchableOpacity`
  position: absolute;
  top: -${({theme}) => theme.spacing.xsslarge}px;
  border-radius: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;

  margin-bottom: 20px;

  shadow-color: ${({theme}) => theme.colors.black};
  shadow-opacity: 0.25;
`;

export const Icon = styled.View`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 50px;
  height: 40px;
  width: 40px;

  align-items: center;
  justify-content: center;
`;
