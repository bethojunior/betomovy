import {Button} from 'react-native-paper';
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
  color: ${({theme}) => theme.colors.primaryText};
`;

export const TextArea = styled.TextInput`
  background-color: ${({theme}) => theme.colors.border_white_light};
  border-radius: 10px;
  text-align: justify;
  padding: 12px;
  margin-top: 20px;
`;

export const ContentLogo = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const ContainerText = styled.View`
  align-items: center;
`;

export const Image = styled.Image`
  width: 150px;
  height: 150px;
`;

export const ViewButton = styled.View`
  width: 100%;
  height: 50px;
  margin-top: ${({theme}) => theme.spacing.xxlarge}px;
`;
export const Buton = styled(Button)`
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 5px;
  width: 100%;
`;
