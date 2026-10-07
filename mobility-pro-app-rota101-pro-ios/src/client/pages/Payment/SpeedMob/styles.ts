import styled from 'styled-components/native';
import {mix} from 'polished';

export const ScrollContent = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.View`
  padding: 20px;
`;

export const Header = styled.View`
  width: 100%;
  height: 100px;
  background-color: ${({theme}) => theme.colors.primary};
  flex-direction: row;
  align-items: center;
`

export const TextHeader = styled.Text`
  flex: 1;
  font-size: 20px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.background_global};
  text-align: center;
`

export const ButtonBack = styled.TouchableOpacity`
  margin-left: 10px;
`

export const Title = styled.Text<{ backgroundColor: string, colorText: string }>`
  width: 100%;
  background-color: ${props => props.backgroundColor};
  font-size: 20px;
  text-align: center;
  color: ${props => props.colorText};
  font-weight: bold;
  margin-top: 10px;
  padding: 15px 0;
  border-radius: 5px;
`;

export const Button = styled.TouchableOpacity< { backgroundColor: string }>`
  background-color: ${props => props.backgroundColor};
  width: 30%;
  align-items: center;
  align-self: center;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
`;

export const CardContent = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const TextButton = styled.Text<{ colorText: string }>`
  color: ${props => props.colorText};
  font-size: ${({theme}) => theme.fontSizes.small}px;
`;

export const CardPaymentForm = styled.View`
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  margin-top: 10px;
  align-items: center;
  padding: 1px;
`;

export const CardVoucher = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  border-radius: 4px;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
  background-color: ${({theme}) => theme.colors.border_white_light};
`;

export const ContentVoucher = styled.View`
  display: flex;
  flex-direction: row;
`;

export const TextBuyVoucher = styled.Text<{ colorText: string }>`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${props => props.colorText};
  margin-right: 10px;
  font-weight: bold;
  align-self: center;
`;

export const Icon = styled.Image`
  width: 30px;
  height: 30px;
`;

export const TextPaymentType = styled.Text<{ colorText: string }>`
  font-size: 18px;
  color: ${props => props.colorText};
`;

export const IconPercentage = styled.Text<{ backgroundColor: string, colorText: string }>`
  align-self: flex-end;
  margin-right: 10px;
  padding: 8px;
  text-align: center;
  border-radius: ${({theme}) => theme.borderRadius.xxxlarge}px;
  background-color: ${props => props.backgroundColor};
  color: ${props => props.colorText};
  font-weight: 600;
`;

export const TitleDeleteCard = styled.Text`
  align-self: center;
  margin-bottom: 20px;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;
