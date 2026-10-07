import styled from 'styled-components/native';
import {mix} from 'polished';

export const ScrollContent = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.View`
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: bold;
  margin-top: 10px;
`;

export const Button = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  width: 30%;
  align-items: center;
  align-self: flex-end;
  padding: 10px;
  border-radius: 5px;
  margin-top: 20px;
`;

export const CardContent = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const TextButton = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
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
  background-color: ${({theme}) => theme.colors.background_white};
`;

export const ContentVoucher = styled.View`
  display: flex;
  flex-direction: row;
`;

export const TextBuyVoucher = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.primary};
  margin-right: 10px;
  font-weight: bold;
  align-self: center;
`;

export const Icon = styled.Image`
  width: 30px;
  height: 30px;
`;

export const TextPaymentType = styled.Text`
  margin-left: 10px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const IconPercentage = styled.Text`
  align-self: center;
  margin-right: 10px;
  padding: 8px;
  text-align: center;
  border-radius: ${({theme}) => theme.borderRadius.xxxlarge}px;
  background-color: ${({theme}) =>
    mix(0.5, theme.colors.primary, theme.colors.secondary)};
  color: ${({theme}) => theme.colors.white};
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
