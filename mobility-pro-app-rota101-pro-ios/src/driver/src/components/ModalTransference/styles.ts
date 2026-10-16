import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

interface SheetContentProps {
  keyboardHeight?: number;
}

export const SheetContent = styled.ScrollView.attrs<SheetContentProps>(({ theme, keyboardHeight = 0 }) => ({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: {
    padding: theme.spacing.xlarge,
    paddingTop: 0,
    paddingBottom: theme.spacing.xlarge + keyboardHeight,
    gap: theme.spacing.large,
  },
}))``;

export const ContentValue = styled.View`
  gap: ${({ theme }) => theme.spacing.small}px;
`;

export const CurrentSaldLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const CurrentSaldValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const TitleValueTransfer = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const InputMoney = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
})`
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.medium}px;
  height: ${RFValue(48)}px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  text-align: center;
`;

export const ObservationContent = styled.View`
  flex-direction: row;
`;

export const Asterisk = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.primary};
`;

export const TextObservation = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const ConfirmButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const ConfirmButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryText};
`;
