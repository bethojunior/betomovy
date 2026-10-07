import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {lighten} from 'polished';
import {SafeAreaView} from 'react-native-safe-area-context';

interface ButtonDriverProps {
  backgroundColor: string;
  isDisabled?: boolean;
}

export const Container = styled.View``;

export const Header = styled.View<{backgroundColor: string}>`
  width: 100%;
  height: 100px;
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.backgroundColor};
  padding: 0 15px;
`;

export const ButtonBack = styled.TouchableOpacity``;

export const TitleHeader = styled.Text<{colorText: string}>`
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.colorText};
`;

export const Body = styled.View`
  padding: 0px;
`;

export const ContentInformationTrip = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0;
  padding: 0 ${RFValue(10)}px;
`;

export const TextDescription = styled.Text<{textColor: string}>`
  font-size: 16px;
  color: ${props => props.textColor};
  font-weight: bold;
  margin: 5px 0;
`;

export const AddressContent = styled.View`
  padding-bottom: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #00000067;
  padding: 0 ${RFValue(10)}px;
`;

export const Address = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
`;

export const Destiny = styled.Text`
  font-size: 18px;
`;

export const Square = styled.View<{color: string}>`
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  margin-right: 10px;
`;

export const Circle = styled.View<{color: string}>`
  width: 10px;
  height: 10px;
  background-color: ${props => props.color};
  border-radius: 360px;
  margin-right: 5px;
`;

export const DriverContent = styled.View`
  margin: 10px 0;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ContentPhotoDriver = styled.View`
  margin-right: 20px;
`;

export const ContentDescriptionDriver = styled.View``;

export const DriverName = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const DescriptionDriver = styled.Text`
  font-size: 16px;
`;

export const ContentActionsDriver = styled.View`
  width: 100%;
  flex-direction: row;
`;

export const ButtonDriver = styled.TouchableOpacity<ButtonDriverProps>`
  width: 50%;
  background-color: ${props =>
    props.isDisabled
      ? lighten(0.2, props.backgroundColor)
      : props.backgroundColor};
  padding: 15px 20px;
  border-radius: 0px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.background_white};
`;

export const TextButtonDriver = styled.Text<{colorText: string}>`
  color: ${props => props.colorText};
  font-size: 18px;
  text-align: center;
`;

export const ContentHelp = styled.View``;

export const ContentHeaderHelp = styled.View`
  width: 100%;
  background-color: ${({theme}) => theme.colors.grayBright};
  flex-direction: row;
  align-items: center;
`;

export const ButtonHeaderHelp = styled.TouchableOpacity`
  padding: ${RFValue(20)}px;
`;

export const ButtonTextsHeaderHelp = styled.Text`
  font-size: ${RFValue(14)}px;
`;

export const ContentItemsList = styled(SafeAreaView)`
  height: ${RFValue(230)}px;
`;

export const ContentReceipt = styled.View`
  padding: ${RFValue(20)}px;
`;

export const ButtonReceiptEmail = styled.TouchableOpacity`
  padding: ${RFValue(15)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${RFValue(30)}px;
`;

export const TextButtonReceiptEmail = styled.Text`
  text-align: center;
  font-size: ${RFValue(13)}px;
  color: ${({theme}) => theme.colors.background_global};
  font-weight: bold;
`;

export const ContentTypeHelp = styled.TouchableOpacity`
  border-bottom-width: 1px;
  border-color: gray;
  padding: ${RFValue(15)}px;
`;

export const PaymentNameTypeHelp = styled.Text`
  font-size: ${RFValue(13)}px;
`;
