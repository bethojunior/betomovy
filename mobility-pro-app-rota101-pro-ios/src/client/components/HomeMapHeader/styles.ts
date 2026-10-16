import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const GreetingPill = styled.View`
  background-color: ${({theme}) => theme.colors.white};
  border-radius: ${({theme}) => theme.borderRadius.xxlarge}px;
  padding: ${({theme}) => theme.spacing.medium}px
    ${({theme}) => theme.spacing.large}px;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: ${RFValue(4)}px;
  elevation: 4;
`;

export const GreetingText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: 600;
`;

export const RightActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const NotificationButtonWrapper = styled.View`
  background-color: ${({theme}) => theme.colors.white};
  width: ${RFValue(38)}px;
  height: ${RFValue(38)}px;
  border-radius: ${RFValue(19)}px;
  align-items: center;
  justify-content: center;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: ${RFValue(4)}px;
  elevation: 4;
`;
