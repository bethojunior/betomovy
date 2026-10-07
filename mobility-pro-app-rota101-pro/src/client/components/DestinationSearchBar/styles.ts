import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({theme}) => theme.colors.background_white};
  border-radius: ${({theme}) => theme.borderRadius.xxxlarge}px;
  padding: 0 ${({theme}) => theme.spacing.medium}px;
  height: ${RFValue(52)}px;
  shadow-color: ${({theme}) => theme.colors.black};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: ${RFValue(4)}px;
  elevation: 2;
`;

export const SearchButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const SearchPlaceholder = styled.Text`
  margin-left: ${({theme}) => theme.spacing.small}px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Divider = styled.View`
  width: ${RFValue(1)}px;
  height: ${RFValue(28)}px;
  background-color: ${({theme}) => theme.colors.border};
  margin: 0 ${({theme}) => theme.spacing.small}px;
`;

export const MicButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  width: ${RFValue(36)}px;
  height: ${RFValue(36)}px;
`;
