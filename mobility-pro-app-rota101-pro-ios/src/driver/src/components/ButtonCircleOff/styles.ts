import {shade} from 'polished';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import theme from '../../styles/theme';

interface ButtonProps {
  enabled?: boolean;
  onPress?: (pointerInside: boolean) => void;
  inverted?: boolean;
}

interface TextProps {
  enabled?: boolean;
  inverted?: boolean;
}

export const Container = styled(TouchableOpacity)<ButtonProps>`
  background-color: ${({enabled, theme}) =>
    enabled ? theme.colors.off : shade(0.6, theme.colors.primaryText)};
  border-radius: ${RFValue(50)}px;
  margin-top: 10px;
  height: ${RFValue(90)}px;
  width: ${RFValue(90)}px;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.View<ButtonProps>`
  height: ${RFValue(80)}px;
  width: ${RFValue(80)}px;
  border-radius: ${RFValue(50)}px;
  border-width: 2px;
  border-color: ${({enabled, theme}) =>
    enabled ? theme.colors.white : theme.colors.white};
  align-items: center;
  justify-content: center;
`;

export const Text = styled.Text<TextProps>`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({enabled, theme}) =>
    enabled ? theme.colors.white : theme.colors.button_text_disabled};
  font-family: ${({theme}) => theme.fonts.regular};
`;
export const Loading = styled.ActivityIndicator`
  margin-left: ${RFValue(10)}px;
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
