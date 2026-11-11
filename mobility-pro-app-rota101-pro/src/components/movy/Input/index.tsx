import React, { forwardRef, useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { movy } from '../theme';

const Wrap = styled.View<{ $focused: boolean }>`
  height: 54px;
  border-radius: 12px;
  border-width: 1.5px;
  border-color: ${({ theme, $focused }) =>
    $focused ? movy.cyan(theme) : movy.border(theme)};
  background-color: ${({ theme }) => theme.colors.white ?? '#FFFFFF'};
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${({ theme }) => theme.spacing.large}px;
`;

const Field = styled(TextInput)`
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  color: ${({ theme }) => theme.colors.secondary ?? '#000'};
`;

const IconSlot = styled.View`
  margin-right: ${({ theme }) => theme.spacing.medium}px;
`;

const ActionSlot = styled.TouchableOpacity`
  margin-left: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.small}px;
`;

export interface MovyInputProps extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const MovyInput = forwardRef<TextInput, MovyInputProps>(
  ({ leftIcon, rightIcon, onRightIconPress, onFocus, onBlur, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);
    const themeLike = useTheme();
    const placeholderColor = movy.muted(themeLike);
    return (
      <Wrap $focused={focused}>
        {leftIcon ? <IconSlot>{leftIcon}</IconSlot> : null}
        <Field
          ref={ref}
          placeholderTextColor={placeholderColor}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon ? (
          <ActionSlot onPress={onRightIconPress} disabled={!onRightIconPress}>
            {rightIcon}
          </ActionSlot>
        ) : null}
      </Wrap>
    );
  },
);

MovyInput.displayName = 'MovyInput';
