import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import {rgba} from 'polished';

export const Container = styled.ScrollView.attrs(({theme}) => ({
  contentContainerStyle: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xlarge,
    paddingBottom: theme.spacing.xlarge,
  },
}))`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xxlarge}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
  margin-top: ${getStatusBarHeight() + RFValue(38)}px;
`;

export const IconWrapper = styled.View`
  align-items: center;
  justify-content: center;
  align-self: center;
  width: ${RFValue(150)}px;
  height: ${RFValue(150)}px;
  border-radius: ${RFValue(75)}px;
  background-color: ${({theme}) => rgba(theme.colors.primary, 0.08)};
  margin-top: ${({theme}) => theme.spacing.xslarge}px;
`;

export const IconBadge = styled.View`
  position: absolute;
  right: ${RFValue(4)}px;
  bottom: ${RFValue(2)}px;
  width: ${RFValue(44)}px;
  height: ${RFValue(44)}px;
  border-radius: ${RFValue(22)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
  border-width: 2px;
  border-color: ${({theme}) => theme.colors.background_global};
`;

export const Description = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.text_gray};
  text-align: center;
  line-height: ${RFValue(21)}px;
  margin-top: ${({theme}) => theme.spacing.xslarge}px;
`;

export const Buttons = styled.View`
  margin-top: ${({theme}) => theme.spacing.xslarge}px;
  gap: ${({theme}) => theme.spacing.large}px;
`;

export const ButtonSignIn = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({theme}) => theme.spacing.medium}px;
  padding-vertical: ${({theme}) => theme.spacing.xxlarge}px;
  padding-horizontal: ${({theme}) => theme.spacing.large}px;
  border-radius: ${({theme}) => theme.radius.medium}px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ButtonRecused = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({theme}) => theme.spacing.medium}px;
  padding-vertical: ${({theme}) => theme.spacing.xxlarge}px;
  padding-horizontal: ${({theme}) => theme.spacing.large}px;
  border-radius: ${({theme}) => theme.radius.medium}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  background-color: ${({theme}) => theme.colors.background_white};
`;

export const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const TextButtonSignIn = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.primaryText};
`;

export const TextButton = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const InfoCard = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: ${({theme}) => theme.spacing.medium}px;
  background-color: ${({theme}) => rgba(theme.colors.primary, 0.06)};
  border-radius: ${({theme}) => theme.radius.medium}px;
  padding: ${({theme}) => theme.spacing.large}px;
  margin-top: ${({theme}) => theme.spacing.xslarge}px;
`;

export const InfoIconBadge = styled.View`
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  border-radius: ${RFValue(16)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const InfoTextColumn = styled.View`
  flex: 1;
`;

export const InfoTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const InfoDescription = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.text_gray};
  margin-top: ${({theme}) => theme.spacing.small}px;
`;
