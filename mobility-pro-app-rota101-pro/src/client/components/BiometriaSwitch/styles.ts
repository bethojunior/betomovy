import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ItemRow = styled.View`
  min-height: ${RFValue(50)}px;
  width: 100%;
  flex-direction: row;
  padding-top: ${({theme}) => theme.spacing.medium}px;
  padding-bottom: ${({theme}) => theme.spacing.medium}px;
  align-items: center;
  gap: ${({theme}) => theme.spacing.medium}px;
  border-bottom-width: ${({theme}) => theme.borderWidth.small}px;
  border-bottom-color: ${({theme}) => theme.colors.border_white_light};
`;

export const TextGroup = styled.View`
  flex: 1;
`;

export const Item = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.secondary};
`;

export const SwitchContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Loading = styled.ActivityIndicator`
  margin-right: ${RFValue(1)}px;
`;
