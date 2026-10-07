import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const Content = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
}))``;

/** Alinha a largura do ReportProblemButton (solto no scroll) com a do ViewFullCalculationButton (dentro do card, com padding próprio). */
export const ReportProblemButtonWrapper = styled.View`
  margin: 0 ${({ theme }) => theme.spacing.large}px;
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
