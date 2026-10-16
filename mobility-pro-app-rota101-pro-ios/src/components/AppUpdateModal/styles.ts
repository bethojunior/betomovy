import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {rgba} from 'polished';

export const Overlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export const Card = styled.View`
  width: 85%;
  background-color: ${({theme}) => theme.colors.background_white};
  border-radius: ${({theme}) => theme.radius.large}px;
  padding: ${({theme}) => theme.spacing.xlarge}px;
  align-items: center;
  shadow-color: ${({theme}) => theme.colors.secondary};
  shadow-offset: 0px ${RFValue(2)}px;
  shadow-opacity: 0.15;
  shadow-radius: ${RFValue(6)}px;
  elevation: 4;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
  margin-top: ${({theme}) => theme.spacing.medium}px;
  margin-bottom: ${({theme}) => theme.spacing.small}px;
`;

export const Description = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.text_gray};
  text-align: center;
  line-height: ${RFValue(19)}px;
  margin-bottom: ${({theme}) => theme.spacing.xlarge}px;
`;

export const UpdateButton = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
  justify-content: center;
  padding-vertical: ${({theme}) => theme.spacing.large}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.radius.medium}px;
`;

export const UpdateButtonText = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.bold};
`;

export const SupportButton = styled.TouchableOpacity`
  width: 100%;
  align-items: center;
  gap: ${({theme}) => theme.spacing.small}px;
  padding-vertical: ${({theme}) => theme.spacing.large}px;
  margin-top: ${({theme}) => theme.spacing.medium}px;
  background-color: ${({theme}) => rgba(theme.colors.primary, 0.12)};
  border-radius: ${({theme}) => theme.radius.medium}px;
`;

export const SupportCaption = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  text-align: center;
`;

export const SupportButtonRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.small}px;
`;

export const SupportButtonText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.medium};
  text-align: center;
`;
