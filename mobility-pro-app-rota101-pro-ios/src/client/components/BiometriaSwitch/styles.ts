import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ItemRow = styled.View`
  width: 100%;
  flex-direction: row;
  padding-top: ${RFValue(15)}px;
  padding-bottom: ${RFValue(15)}px;
  align-items: center;
  justify-content: space-between;
`;

export const Item = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;

export const SwitchContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Loading = styled.ActivityIndicator`
  margin-right: ${RFValue(1)}px;
`;
