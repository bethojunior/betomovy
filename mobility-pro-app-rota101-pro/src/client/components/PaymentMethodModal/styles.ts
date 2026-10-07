import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Content = styled.View`
  height: ${RFValue(450)}px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-family: ${({theme}) => theme.fonts.medium};
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const TitleSpeedMob = styled.Text<{ colorText }>`
  text-align: center;
  font-size: 23px;
  font-family: ${({theme}) => theme.fonts.medium};
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.border};
  color: ${({theme}) => theme.colors.primary};
`

export const SelectPaymentMethodButton = styled.TouchableOpacity`
  margin: 8px 0;
  border-radius: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.border};
  height: 45px;
  justify-content: center;
  /* elevation: 3; */
`;

export const SelectPaymentMethodButtonSpeedMob = styled.TouchableOpacity`
  margin: 8px 0;
  border-radius: 15px;
  height: 45px;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
`

export const PaymentMethodName = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
  text-transform: uppercase;
`;
