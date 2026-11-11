import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({theme}) => theme.colors.white ?? '#FFFFFF'};
  border-radius: ${({theme}) => theme.borderRadius.xxxlarge}px;
  padding: 0 ${({theme}) => theme.spacing.medium}px;
  height: ${RFValue(56)}px;
  border-width: 1.5px;
  border-color: ${({theme}) => theme.colors.gray_border ?? '#E2E8F0'};
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: ${RFValue(10)}px;
  elevation: 4;
`;

export const SearchButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const SearchPlaceholder = styled.Text`
  margin-left: ${({theme}) => theme.spacing.small}px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.gray_muted ?? '#64748B'};
`;

export const Divider = styled.View`
  width: ${RFValue(1)}px;
  height: ${RFValue(28)}px;
  background-color: ${({theme}) => theme.colors.gray_border ?? '#E2E8F0'};
  margin: 0 ${({theme}) => theme.spacing.small}px;
`;

export const MicButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  background-color: ${({theme}) => theme.colors.cyan_electric ?? '#04F3FA'};
`;
