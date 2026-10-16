import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { rgba } from 'polished';
import styled from 'styled-components/native';

const MAX_SHEET_HEIGHT = Dimensions.get('window').height * 0.85;

export const ScrollContent = styled.ScrollView.attrs(({ theme }) => ({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: {
    paddingHorizontal: theme.spacing.xlarge,
    paddingBottom: theme.spacing.xlarge,
  },
}))`
  max-height: ${MAX_SHEET_HEIGHT}px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

export const IconBadge = styled.View`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => rgba(theme.colors.red, 0.12)};
`;

export const TitleColumn = styled.View`
  flex: 1;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Subtitle = styled.Text`
  color: ${({ theme }) => theme.colors.text_gray};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  line-height: ${RFValue(18)}px;
  margin-top: ${RFValue(2)}px;
`;

export const TextArea = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
  multiline: true,
  textAlignVertical: 'top',
})`
  height: ${RFValue(120)}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
`;

export const ContentButton = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.medium}px;
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small}px;
  padding-vertical: ${({ theme }) => theme.spacing.large}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
`;

export const CancelButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.medium};
`;

export const ConfirmButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small}px;
  padding-vertical: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`;

export const ConfirmButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-family: ${({ theme }) => theme.fonts.bold};
`;
