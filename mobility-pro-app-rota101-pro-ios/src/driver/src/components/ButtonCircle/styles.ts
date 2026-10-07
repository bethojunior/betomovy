import {shade} from 'polished';
import {TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

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
    enabled ? theme.colors.primary : shade(0.2, theme.colors.primary)};
  border-radius: ${RFValue(50)}px;
  margin-top: 10px;
  height: ${RFValue(90)}px;
  width: ${RFValue(90)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const Text = styled.Text<TextProps>`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({enabled, theme}) =>
    enabled ? theme.colors.primaryText : theme.colors.button_text_disabled};
  font-family: ${({theme}) => theme.fonts.regular};
`;
export const Loading = styled.ActivityIndicator``;
