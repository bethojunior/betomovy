import {shade} from 'polished';
import {TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ButtonProps {
  enabled?: boolean;
  onPress?: (pointerInside: boolean) => void;
  inverted?: boolean;
  color?: string;
}

interface TextProps {
  enabled?: boolean;
  inverted?: boolean;
}

export const Container = styled(TouchableOpacity)<ButtonProps>`
  width: 100%;
  background-color: ${({enabled, theme, color}) =>
    enabled
      ? color
        ? color
        : theme.colors.primary
      : shade(0.2, color ? color : theme.colors.primary)};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  align-items: center;
  margin-top: ${RFValue(10)}px;
  height: ${RFValue(50)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export const Text = styled.Text<TextProps>`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-weight: bold;
  color: ${({enabled, theme}) =>
    enabled ? theme.colors.primaryText : theme.colors.button_text_disabled};
  font-family: ${({theme}) => theme.fonts.medium};
`;
export const Loading = styled.ActivityIndicator`
  margin-left: ${RFValue(10)}px;
`;
