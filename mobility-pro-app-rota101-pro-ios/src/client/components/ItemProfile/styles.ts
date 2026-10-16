import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View<{isLast?: boolean}>`
  width: 100%;
  padding-vertical: ${({theme}) => theme.spacing.medium}px;
  border-bottom-width: ${({isLast, theme}) => (isLast ? 0 : theme.borderWidth.small)}px;
  border-bottom-color: ${({theme}) => theme.colors.border_white_light};
`;

export const ContentText = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const TextGroup = styled.View`
  flex: 1;
`;

export const Item = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;

export const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  max-width: 55%;
`;

export const LabelValue = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.text_gray};
  font-family: ${({theme}) => theme.fonts.regular};
  margin-right: ${({theme}) => theme.spacing.small}px;
`;

export const RequiredContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
  margin-top: ${RFValue(2)}px;
`;

export const RequiredLabel = styled.Text`
  color: ${({theme}) => theme.colors.red};
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-family: ${({theme}) => theme.fonts.medium};
`;
