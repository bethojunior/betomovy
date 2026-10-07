import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  width: 100%;
  background: ${({theme}) => theme.colors.white};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  border-width: 1.5px;
  border-color: ${({theme}) => theme.colors.primary};
  flex-direction: row;
  justify-content: space-between;
  padding-left: ${RFValue(10)}px;
  padding-right: ${RFValue(5)}px;
  align-items: center;
  padding-top: ${RFValue(8)}px;
  padding-bottom: ${RFValue(8)}px;
  margin-bottom: ${RFValue(10)}px;
`;

export const Doc = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  max-width: 90%;
  color: ${({theme}) => theme.colors.secondary};
  font-family: ${({theme}) => theme.fonts.secondary_regular};
  text-decoration: none;
`;

export const ContentDoc = styled.View``;

export const Status = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${RFValue(8)}px;
`;

export const StatusText = styled.Text`
  font-size: ${RFValue(13)}px;
  margin-left: ${RFValue(5)}px;
  color: ${({theme}) => theme.colors.red};
  font-family: ${({theme}) => theme.fonts.secondary_bold};
  text-decoration: none;
`;
