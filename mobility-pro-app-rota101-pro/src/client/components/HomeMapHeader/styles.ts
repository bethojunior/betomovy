import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const GreetingPill = styled.View`
  background-color: ${({theme}) => theme.colors.navy_deep ?? '#070A1A'};
  border-radius: ${({theme}) => theme.borderRadius.xxlarge}px;
  padding: ${RFValue(10)}px ${({theme}) => theme.spacing.large}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.cyan_electric ?? '#04F3FA'}33;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: ${RFValue(8)}px;
  elevation: 6;
`;

export const GreetingText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.cyan_electric ?? '#04F3FA'};
  font-family: ${({theme}) => theme.fonts.bold};
`;

export const RightActions = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const NotificationButtonWrapper = styled.View`
  background-color: ${({theme}) => theme.colors.navy_deep ?? '#070A1A'};
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.cyan_electric ?? '#04F3FA'}33;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.25;
  shadow-radius: ${RFValue(8)}px;
  elevation: 6;
`;
