import {shade} from 'polished';
import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

export const ButtonOffer = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: ${RFValue(8)}px;
  flex: 1;
  margin: 0px ${RFValue(2)}px;
  border-radius: ${({theme}) => theme.borderRadius.small}px;
  background-color: ${({theme}) => shade(0.05, theme.colors.primary)};
`;
