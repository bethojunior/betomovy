import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const ContainerCardBoard = styled.ScrollView`
  width: 25%;
  max-height: 50px;
  padding: ${RFValue(2)}px;
  margin: 0 10px;
  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: 5px;
`;

export const ButtonSend = styled.TouchableOpacity``;

export const TextCard = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.primary};
  text-align: center;
`;
