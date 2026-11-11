import React from 'react';
import { ActivityIndicator, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { movy } from '../theme';

export type MovyButtonVariant = 'primary' | 'accent' | 'outline' | 'danger' | 'ghost';
export type MovyButtonSize = 'md' | 'lg';

interface ButtonStyleProps {
  $variant: MovyButtonVariant;
  $size: MovyButtonSize;
  theme: any;
}

const bgFor = ({ $variant, theme }: ButtonStyleProps): string => {
  switch ($variant) {
    case 'primary':
      return movy.royal(theme);
    case 'accent':
      return movy.cyan(theme);
    case 'danger':
      return movy.danger(theme);
    case 'outline':
    case 'ghost':
      return 'transparent';
    default:
      return movy.royal(theme);
  }
};

const textFor = ({ $variant, theme }: ButtonStyleProps): string => {
  switch ($variant) {
    case 'primary':
    case 'danger':
      return '#FFFFFF';
    case 'accent':
      return movy.navy(theme);
    case 'outline':
      return movy.royal(theme);
    case 'ghost':
      return theme.colors.text_gray ?? movy.muted(theme);
    default:
      return '#FFFFFF';
  }
};

const Container = styled(TouchableOpacity)<ButtonStyleProps & { $disabled?: boolean }>`
  min-height: ${({ $size }) => ($size === 'lg' ? 56 : 52)}px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding-horizontal: ${({ theme }) => theme.spacing.xlarge}px;
  background-color: ${bgFor};
  border-width: ${({ $variant }) => ($variant === 'outline' ? 1.5 : 0)}px;
  border-color: ${({ $variant, theme }) =>
    $variant === 'outline' ? movy.royal(theme) : 'transparent'};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
`;

const Label = styled.Text<ButtonStyleProps>`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  color: ${textFor};
`;

export interface MovyButtonProps extends TouchableOpacityProps {
  variant?: MovyButtonVariant;
  size?: MovyButtonSize;
  loading?: boolean;
  disabled?: boolean;
  label: string;
}

export function MovyButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  label,
  onPress,
  ...rest
}: MovyButtonProps) {
  const inactive = disabled || loading;
  const themeLike = useTheme();
  const indicatorColor =
    variant === 'accent'
      ? movy.navy(themeLike)
      : variant === 'ghost' || variant === 'outline'
        ? movy.royal(themeLike)
        : '#FFFFFF';
  return (
    <Container
      $variant={variant}
      $size={size}
      $disabled={inactive}
      disabled={inactive}
      onPress={inactive ? undefined : onPress}
      activeOpacity={0.85}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        <Label $variant={variant} $size={size}>
          {label}
        </Label>
      )}
    </Container>
  );
}
