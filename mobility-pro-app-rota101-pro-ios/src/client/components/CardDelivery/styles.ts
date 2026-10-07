import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ContainerProps {
  selected?: boolean;
  m?: string;
}

export const ContainerCard = styled.TouchableOpacity<ContainerProps>`
  border: 1px solid  ${({theme}) => theme.colors.primary};
  background-color: ${({theme, selected}) => selected ? shade(0.1, theme.colors.primary) : 'transparent'};
  margin: ${({m}) => m || '0'};
  flex: 1;
  width: ${RFValue(120)}px;
  height: ${RFValue(120)}px;

  justify-content: center;
  align-items: center;

  border-radius: 10px;
`;

export const Image = styled.Image`
  width: 60%;
  height: 60%;
`;
