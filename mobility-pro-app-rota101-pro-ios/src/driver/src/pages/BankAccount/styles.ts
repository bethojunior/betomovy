import { rgba } from 'polished';
import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const HeaderButton = styled.TouchableOpacity`
  min-width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  align-items: center;
  justify-content: center;
`;

export const HeaderTitle = styled.Text`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const HeaderActionText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const IntroCard = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  flex-direction: row;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const IntroIconWrapper = styled.View`
  width: ${RFValue(44)}px;
  height: ${RFValue(44)}px;
  border-radius: ${RFValue(22)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const IntroTextGroup = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

export const IntroTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const IntroSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const ModeBadge = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
  padding: ${({ theme }) => theme.spacing.small}px ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.xxxlarge}px;
  background-color: ${({ theme }) => rgba(theme.colors.primary, 0.12)};
`;

export const ModeBadgeText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

interface ContentProps {
  keyboardHeight?: number;
}

export const Content = styled.ScrollView.attrs<ContentProps>(({ theme, keyboardHeight = 0 }) => ({
  keyboardShouldPersistTaps: 'handled',
  contentContainerStyle: {
    padding: theme.spacing.large,
    paddingBottom: theme.spacing.large + keyboardHeight,
    gap: theme.spacing.xlarge,
  },
}))`
  flex: 1;
`;

interface SaveButtonProps {
  disabled?: boolean;
}

export const Footer = styled.View`
  padding: ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.white};
  border-top-width: ${({ theme }) => theme.borderWidth.small}px;
  border-top-color: ${({ theme }) => theme.colors.border};
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const FooterRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const SaveButton = styled.TouchableOpacity<SaveButtonProps>`
  flex: 1;
  height: ${RFValue(52)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${RFValue(8)}px;
  padding: 0 ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const SaveButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryText};
`;

export const BackButton = styled.TouchableOpacity`
  flex: 1;
  height: ${RFValue(52)}px;
  align-items: center;
  justify-content: center;
  padding: 0 ${({ theme }) => theme.spacing.large}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme }) => theme.colors.border};
`;

export const BackButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const ErrorText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.red};
  text-align: center;
`;

export const EmptyCard = styled.View`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.xslarge}px ${({ theme }) => theme.spacing.large}px;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const EmptyIconWrapper = styled.View`
  width: ${RFValue(56)}px;
  height: ${RFValue(56)}px;
  border-radius: ${RFValue(28)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const EmptyTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
`;

export const EmptyDescription = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
`;
