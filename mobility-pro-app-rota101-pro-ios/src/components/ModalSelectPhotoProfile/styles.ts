import styled from 'styled-components/native';
import {Pressable} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {transparentize} from 'polished';

export const Content = styled.View`
  padding: 0 ${({theme}) => theme.spacing.xlarge}px ${({theme}) => theme.spacing.xlarge}px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
`;

export const Subtitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.text_gray};
  text-align: center;
  margin-top: ${({theme}) => theme.spacing.small}px;
  margin-bottom: ${({theme}) => theme.spacing.xlarge}px;
`;

export const OptionCard = styled(Pressable)<{$pressed?: boolean}>`
  flex-direction: row;
  align-items: center;
  background-color: ${({theme, $pressed}) =>
    $pressed ? transparentize(0.93, theme.colors.primary) : theme.colors.background_white};
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  padding: ${({theme}) => theme.spacing.large}px;
  gap: ${({theme}) => theme.spacing.large}px;
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px ${RFValue(1)}px;
  shadow-opacity: ${({$pressed}) => ($pressed ? 0 : 0.08)};
  shadow-radius: ${RFValue(4)}px;
  elevation: ${({$pressed}) => ($pressed ? 0 : 2)};
`;

export const OptionIconBadge = styled.View`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  border-radius: ${RFValue(24)}px;
  background-color: ${({theme}) => theme.colors.white};
  align-items: center;
  justify-content: center;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px ${RFValue(1)}px;
  shadow-opacity: 0.1;
  shadow-radius: ${RFValue(2)}px;
  elevation: 1;
`;

export const OptionTextColumn = styled.View`
  flex: 1;
`;

export const OptionTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const OptionDescription = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.text_gray};
  margin-top: ${({theme}) => theme.spacing.small}px;
`;

export const CancelCard = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  padding-vertical: ${({theme}) => theme.spacing.large}px;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const CancelText = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
`;
