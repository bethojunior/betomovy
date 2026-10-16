import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const ContentVehicle = styled.ScrollView.attrs<{ keyboardHeight?: number }>(
  ({ theme, keyboardHeight = 0 }) => ({
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      padding: theme.spacing.large,
      paddingBottom: theme.spacing.large + keyboardHeight,
      gap: theme.spacing.large,
    },
  }),
)``;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

interface ActionButtonProps {
  variant?: 'primary' | 'destructive' | 'secondary';
  disabled?: boolean;
}

export const ActionButton = styled.TouchableOpacity<ActionButtonProps>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small}px;
  background-color: ${({ theme, variant }) => {
    if (variant === 'secondary') return theme.colors.white;
    return variant === 'destructive' ? theme.colors.destructive : theme.colors.primary;
  }};
  border-width: ${({ theme, variant }) => (variant === 'secondary' ? theme.borderWidth.small : 0)}px;
  border-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const ActionButtonText = styled.Text<ActionButtonProps>`
  color: ${({ theme, variant }) => {
    return variant === 'secondary' ? theme.colors.primary : theme.colors.primaryText;
  }};
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
`;
