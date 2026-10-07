import {lighten} from 'polished';
import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

interface ContainerProps {
  disabled?: boolean;
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  height: ${RFValue(35)}px;
  width: ${RFValue(35)}px;
  border-radius: ${RFValue(50)}px;
  background-color: ${({theme, disabled}) =>
    !disabled ? theme.colors.primary : lighten(0.4, theme.colors.primary)};
  align-items: center;
  justify-content: center;
`;
