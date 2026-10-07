import {shade} from 'polished';
import styled from 'styled-components/native';

interface PropsCard {
  selected?: boolean;
}

export const CardContent = styled.TouchableOpacity<PropsCard>`
  flex-direction: row;
  border-radius: 10px;
  background-color: ${({selected, theme}) =>
    selected ? shade(0.05, theme.colors.primary) : theme.colors.primary};
  margin-bottom: 10px;
`;

export const CardPaymentForm = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 7px;
  align-items: center;
`;

export const TextPaymentType = styled.Text`
  margin-left: 10px;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const Icon = styled.Image`
  width: 30px;
  height: 30px;
`;
