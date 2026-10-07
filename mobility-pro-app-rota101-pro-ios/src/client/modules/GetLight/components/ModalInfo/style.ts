import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: ${({theme}) => theme.colors.background_global};
  padding: 0 ${({theme}) => theme.spacing.small}px;
  max-height: 400px;
`;

export const ImageCar = styled.Image`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;
  margin-right: 10px;
`;
export const ContainerContent = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const ContainerColumnText = styled.View`
  flex: 1;
  align-items: flex-start;
  width: 100%;
  padding-bottom: ${({theme}) => theme.spacing.medium}px;
  margin-left: ${({theme}) => theme.spacing.medium}px;
`;

export const ContainerIcon = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const TextTitle = styled.Text`
  font-size: ${RFValue(14)}px;
  margin-bottom: ${({theme}) => theme.spacing.small}px;
  font-weight: bold;
`;
