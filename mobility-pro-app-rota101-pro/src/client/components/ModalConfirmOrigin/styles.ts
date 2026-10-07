import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  height: ${RFValue(200)}px;
  border-top-width: 0.5px;
  border-top-color: ${({theme}) => theme.colors.text_gray};
`;

export const HeaderTitle = styled.Text`
  font-size: ${RFValue(16)}px;
  text-align: center;
  padding: ${RFValue(13)}px;
  font-weight: bold;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.grayBright};
`;

export const Body = styled.View`
  padding: 0 ${RFValue(10)}px;
`;

export const ButtonConfirm = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.primary};
  padding: ${RFValue(13)}px;
`;

export const TextBtnConfirm = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: ${RFValue(13)}px;
  text-align: center;
`;

export const ContentAddress = styled.View`
  padding: ${RFValue(10)}px;
  margin: ${RFValue(10)}px 0;
  flex-direction: row;
  align-items: center;
  gap: 15px;
`;

export const AddressOrigin = styled.Text`
  font-size: ${RFValue(13)}px;
  flex: 1;
`;

export const ButtonFixAddress = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.grayBright};
  padding: ${RFValue(10)}px ${RFValue(16)}px;
  border-radius: 360px;
`;

export const TextBtnFixAddress = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${RFValue(13)}px;
`;
