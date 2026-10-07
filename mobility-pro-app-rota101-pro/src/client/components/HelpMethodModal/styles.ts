import styled from 'styled-components/native';

export const Header = styled.View`
  height: 60px;
  flex-direction: row-reverse;
  align-items: center;
  padding: 0 ${({theme}) => theme.spacing.xxlarge}px;
  justify-content: space-between;
`;

export const ButtonBack = styled.TouchableOpacity``;

export const Content = styled.View`
  margin-top: 20px;
`;

export const Title = styled.Text`
  font-size: 18px;
`;

export const SelectPaymentMethodButton = styled.TouchableOpacity`
  border-width: 0.5px;
  border-color: ${({theme}) => theme.colors.primary};
  border-radius: 4px;
  padding: 14px;
  margin-bottom: 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const PaymentMethodName = styled.Text`
  font-size: 14px;
`;
