import {Dimensions} from 'react-native';
import styled from 'styled-components/native';

const MAX_SHEET_HEIGHT = Dimensions.get('window').height * 0.85;

export const ScrollContent = styled.ScrollView.attrs(({theme, keyboardHeight = 0}) => ({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: {
    paddingHorizontal: theme.spacing.xlarge,
    paddingBottom: theme.spacing.xlarge + keyboardHeight,
  },
}))`
  max-height: ${MAX_SHEET_HEIGHT}px;
`;

export const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.small}px;
  margin-bottom: ${({theme}) => theme.spacing.xlarge}px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

export const TextError = styled.Text`
  color: ${({theme}) => theme.colors.red};
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
`;

export const FieldLabel = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: ${({theme}) => theme.spacing.small}px;
`;

export const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
  padding-horizontal: ${({theme}) => theme.spacing.medium}px;
`;

export const Input = styled.TextInput.attrs(({theme}) => ({
  underlineColorAndroid: 'transparent',
  placeholderTextColor: theme.colors.placeholder,
}))`
  flex: 1;
  padding-vertical: ${({theme}) => theme.spacing.medium}px;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const EyeButton = styled.TouchableOpacity`
  padding: ${({theme}) => theme.spacing.small}px;
`;

export const ContentButton = styled.View`
  flex-direction: row;
  gap: ${({theme}) => theme.spacing.medium}px;
  margin-top: ${({theme}) => theme.spacing.medium}px;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({theme}) => theme.spacing.small}px;
  padding-vertical: ${({theme}) => theme.spacing.large}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;

export const CancelButtonText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.medium};
`;

export const ConfirmButton = styled.TouchableOpacity<{disabled?: boolean}>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({theme}) => theme.spacing.small}px;
  padding-vertical: ${({theme}) => theme.spacing.large}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  opacity: ${({disabled}) => (disabled ? 0.6 : 1)};
`;

export const ConfirmButtonText = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
`;
