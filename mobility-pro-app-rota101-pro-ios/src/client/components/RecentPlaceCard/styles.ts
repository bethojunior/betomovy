import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface CardProps {
  hasBorder?: boolean;
}

export const Card = styled.TouchableOpacity<CardProps>`
  flex-direction: row;
  align-items: center;
  padding: ${({theme}) => theme.spacing.medium}px 0;
  border-bottom-width: ${({hasBorder}) => (hasBorder ? RFValue(1) : 0)}px;
  border-color: ${({theme}) => theme.colors.border};
`;

export const IconWrapper = styled.View`
  width: ${RFValue(36)}px;
  height: ${RFValue(36)}px;
  border-radius: ${RFValue(18)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.background_white};
`;

export const AddressText = styled.Text`
  flex: 1;
  margin: 0 ${({theme}) => theme.spacing.medium}px;
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const DistanceText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.text_gray};
  margin-right: ${({theme}) => theme.spacing.small}px;
`;

export const OptionsButton = styled.Pressable`
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  align-items: center;
  justify-content: center;
`;
