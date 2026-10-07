import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const ButtonSend = styled.TouchableOpacity`
  width: 100%;
  margin: 10px 0;
  border: 0.5px solid ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  height: ${RFValue(45)}px;
`;

export const TextCard = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.primary};
  text-align: center;
  padding: 5px;
`;
