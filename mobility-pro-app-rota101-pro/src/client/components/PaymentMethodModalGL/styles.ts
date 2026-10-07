import {lighten, shade} from 'polished';
import styled from 'styled-components/native';

export const Container = styled.View`
  max-height: 450px;
`;

export const Header = styled.View`
  padding-top: 10px;
  padding-left: 10px;
  height: 60px;
  justify-content: center;
`;

export const ButtonBack = styled.TouchableOpacity`
  padding: 10px;
  position: absolute;
  margin: 10px 0 0 2px;
`;

export const Title = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
`;

export const SelectPaymentMethodButton = styled.TouchableOpacity`
  margin: 8px 0;
  border-radius: 15px;
  border: 1px solid ${({theme}) => shade(0.3, theme.colors.primary)};
  background-color: ${({theme}) => theme.colors.primary};
  height: 45px;
  align-items: center;
  justify-content: center;
  elevation: 3;
`;

export const PaymentMethodName = styled.Text`
  font-size: 14px;
  color: ${({theme}) => theme.colors.primaryText};
`;
