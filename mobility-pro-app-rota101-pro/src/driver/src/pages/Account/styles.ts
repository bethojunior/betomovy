import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    padding: theme.spacing.large,
    gap: theme.spacing.large,
  },
}))`
  background-color: ${({ theme }) => theme.colors.background_global};
  flex: 1;
`;

export const AlertContent = styled.View`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const AlertIconWrapper = styled.View`
  width: ${RFValue(64)}px;
  height: ${RFValue(64)}px;
  border-radius: ${RFValue(32)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const AlertBody = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
  line-height: ${RFValue(20)}px;
`;

export const BalanceCard = styled.View`
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  gap: ${({ theme }) => theme.spacing.large}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
  elevation: 2;
`;

export const BalanceCardTop = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const BalanceIconWrapper = styled.View`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
  border-radius: ${RFValue(40)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const BalanceTextGroup = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

export const BalanceLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const BalanceValue = styled.Text<{ negative?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge}px;
  font-weight: 700;
  color: ${({ theme, negative }) => (negative ? theme.colors.red : theme.colors.secondary)};
`;

export const HideBalanceButton = styled.TouchableOpacity`
  position: absolute;
  top: ${({ theme }) => theme.spacing.medium}px;
  right: ${({ theme }) => theme.spacing.medium}px;
  padding: ${RFValue(4)}px;
  z-index: 1;
`;

export const NegativeBadge = styled.View`
  align-self: flex-start;
  background-color: ${({ theme }) => theme.colors.redLight};
  border-radius: ${({ theme }) => theme.borderRadius.xxxlarge}px;
  padding: ${RFValue(3)}px ${({ theme }) => theme.spacing.medium}px;
`;

export const NegativeBadgeText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.red};
`;

export const NegativeMessage = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.text_gray};
  line-height: ${RFValue(14)}px;
`;

export const ActionButtonsRow = styled.View`
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const ActionOutlineButton = styled.TouchableOpacity<{ filled?: boolean }>`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme, filled }) => (filled ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ theme, filled }) => (filled ? theme.colors.primary : 'transparent')};
  padding: ${({ theme }) => theme.spacing.medium}px;
`;

export const ActionOutlineButtonText = styled.Text<{ filled?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme, filled }) => (filled ? theme.colors.primaryText : theme.colors.secondary)};
`;

export const MovementsHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MovementsTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const SeeAllLink = styled.TouchableOpacity``;

export const SeeAllLinkText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.black};
`;
