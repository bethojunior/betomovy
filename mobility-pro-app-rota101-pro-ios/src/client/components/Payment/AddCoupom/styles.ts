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
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const Title = styled.Text`
  flex-shrink: 1;
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
`;

/**
 * Borda fica no wrapper, não na TextInput — no Android, o próprio EditText
 * desenha um sublinhado nativo por baixo do border-radius, que vaza como um
 * traço preto além dos cantos arredondados mesmo com underlineColorAndroid
 * transparent. Com a TextInput sem borda própria (só flex, sem decoração),
 * esse traço nativo não tem mais como aparecer.
 */
export const InputWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  padding-horizontal: ${({theme}) => theme.spacing.medium}px;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const Input = styled.TextInput.attrs({
  underlineColorAndroid: 'transparent',
})`
  flex: 1;
  padding-vertical: ${({theme}) => theme.spacing.medium}px;
  color: ${({theme}) => theme.colors.secondary};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;

export const ContentButton = styled.View`
  flex-direction: row;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
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
  align-items: center;
  justify-content: center;
  padding-vertical: ${({theme}) => theme.spacing.large}px;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  opacity: ${({disabled}) => (disabled ? 0.5 : 1)};
`;

export const ConfirmButtonText = styled.Text`
  color: ${({theme}) => theme.colors.primaryText};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
`;
