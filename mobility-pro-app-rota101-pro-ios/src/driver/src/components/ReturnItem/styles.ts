import {StyleSheet} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import theme from '../../../../client/styles/theme';

interface PropsContainer {
  selected?: boolean;
}

interface TextReturnProps{
  colorText?: string;
}

export const Container = styled.TouchableOpacity<PropsContainer>`
  align-items: center;
  justify-content: center;
  height: ${RFValue(28)}px;
  width: ${RFValue(85)}px;
  border-radius: ${({theme}) => theme.borderRadius.small}px;
  background: ${({theme, selected}) =>
    !selected ? theme.colors.primaryText : theme.colors.background_greenLight};
`;

export const styles = StyleSheet.create({
  shadow: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: theme.colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 24,
  },
});

export const TextReturn = styled.Text<TextReturnProps>`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${props => props.colorText ? props.colorText : ({theme}) => theme.colors.primary};
`;
