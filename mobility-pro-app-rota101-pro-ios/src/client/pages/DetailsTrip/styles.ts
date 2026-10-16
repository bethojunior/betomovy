import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = styled(SafeAreaView).attrs({
  edges: ['bottom'],
})`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const Content = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
}))``;

export const CarInfoText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const FavoriteBlockRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xlarge}px;
  padding-top: ${({ theme }) => theme.spacing.medium}px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

export const FavoriteBlockButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
`;

export const FavoriteBlockText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const ActionButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${RFValue(8)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const ActionButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryText};
`;

export const CancelScheduledButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${RFValue(8)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const CancelScheduledButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryText};
`;

export const ErrorContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.xlarge}px;
`;

export const ErrorTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const ErrorSubtitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const RetryButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(8)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.medium}px ${({ theme }) => theme.spacing.large}px;
  margin-top: ${({ theme }) => theme.spacing.medium}px;
`;

export const RetryButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.white};
`;
