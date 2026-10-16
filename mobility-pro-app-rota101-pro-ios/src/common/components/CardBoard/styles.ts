import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const ContainerCardBoard = styled.View`
  flex: 1;
  min-height: ${RFValue(44)}px;
  justify-content: center;
  padding: ${RFValue(6)}px ${RFValue(8)}px;
  margin: 0 ${RFValue(6)}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: 20px;
`;

export const TextCard = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.primaryText};
  text-align: center;
`;
