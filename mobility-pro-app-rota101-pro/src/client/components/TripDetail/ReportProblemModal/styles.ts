import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ModalOverlay = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: ${({ theme }) => theme.colors.background_black_light};
`;

export const ModalSheet = styled(SafeAreaView).attrs({
  edges: ['bottom'],
})`
  background-color: ${({ theme }) => theme.colors.background_white};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.xlarge}px;
  border-top-right-radius: ${({ theme }) => theme.borderRadius.xlarge}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  max-height: 85%;
`;

export const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

export const ModalTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const OptionRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const OptionRadio = styled.View<{ selected?: boolean }>`
  width: ${RFValue(18)}px;
  height: ${RFValue(18)}px;
  border-radius: ${RFValue(9)}px;
  border-width: 2px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  align-items: center;
  justify-content: center;
`;

export const OptionRadioDot = styled.View`
  width: ${RFValue(9)}px;
  height: ${RFValue(9)}px;
  border-radius: ${RFValue(5)}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const OptionLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const MessageInput = styled.TextInput.attrs(({ theme }) => ({
  underlineColorAndroid: 'transparent',
  placeholderTextColor: theme.colors.placeholder,
  multiline: true,
  textAlignVertical: 'top',
}))`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin-top: ${({ theme }) => theme.spacing.large}px;
  height: ${RFValue(90)}px;
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const SubmitButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  margin-top: ${({ theme }) => theme.spacing.large}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const SubmitButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
`;
