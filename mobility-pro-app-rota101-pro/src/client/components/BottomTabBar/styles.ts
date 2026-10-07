import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  background-color: ${({theme}) => theme.colors.white};
  margin: ${({theme}) => theme.spacing.medium}px;
  padding: ${({theme}) => theme.spacing.small}px;
  border-radius: ${({theme}) => theme.borderRadius.xxxlarge}px;
  elevation: 4;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.12;
  shadow-radius: ${RFValue(6)}px;
`;

export const Tab = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  height: ${RFValue(32)}px;
`;

export const TabText = styled.Text<{isActive?: boolean}>`
  font-size: ${RFValue(8)}px;
  margin-top: ${RFValue(2)}px;
  color: ${({theme, isActive}) =>
    isActive ? theme.colors.primary : theme.colors.grayLight};
  font-weight: ${({isActive}) => (isActive ? '600' : '500')};
`;
