import { shade } from 'polished';
import { TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import { USE_DARK_PRIMARY_VARIANT } from '~/constantBuild/config';

export type ButtonVariant = 'solid' | 'outline';

interface ButtonProps {
  enabled?: boolean;
  onPress?: (pointerInside: boolean) => void;
  inverted?: boolean;
  color?: string;
  variant?: ButtonVariant;
}

interface TextProps {
  enabled?: boolean;
  inverted?: boolean;
  textSize?: number;
  variant?: ButtonVariant;
  color?: string;
}

export const CustomButton = styled(TouchableOpacity)<ButtonProps>`
  width: 100%;
  background-color: ${({ enabled, theme, color }) => enabled ? (color ?? theme.colors.primary) : shade(0.2, color ?? theme.colors.primary)};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  align-items: center;
  height: ${RFValue(46)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  ${({ variant, theme, color }) =>
    variant === 'outline' &&
    css`
      background-color: transparent;
      border-width: 1px;
      border-color: ${color ?? USE_DARK_PRIMARY_VARIANT ? theme.colors.secondary : theme.colors.primary};
    `}
`;

export const Title = styled.Text<TextProps>`
  font-size: ${({ theme, textSize }) => (textSize ? RFValue(textSize) : theme.fontSizes.medium)}px;
  color: ${({ enabled, theme, color }) =>
    !enabled ? theme.colors.button_text_disabled : (color ?? theme.colors.primaryText)};
  font-family: ${({ theme }) => theme.fonts.bold};
  letter-spacing: 0.5px;
  text-align: center;

  ${({ variant, theme, color }) =>
    variant === 'outline' &&
    css`
      color: ${color ?? USE_DARK_PRIMARY_VARIANT ? theme.colors.secondary : theme.colors.primary};
    `}
`;

export const Spinner = styled.ActivityIndicator.attrs(({ color, theme }) => ({
  color: color ?? USE_DARK_PRIMARY_VARIANT ? theme.colors.secondary : theme.colors.primary,
  size: 'small',
}))``;

export const IconWrapper = styled.View`
  margin-right: ${({ theme }) => theme.spacing.small}px;
`;
