import PagerView from 'react-native-pager-view';
import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Pager = styled(PagerView)`
  height: ${RFValue(126)}px;
`;

export const Page = styled.View`
  flex: 1;
  padding: ${RFValue(4)}px ${({ theme }) => theme.spacing.small}px;
`;

export const Card = styled.View`
  flex: 1;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  gap: ${({ theme }) => theme.spacing.medium}px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.06;
  shadow-radius: 6px;
  elevation: 2;
`;

export const SummaryList = styled.View`
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const SummaryItemRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const SummaryLabel = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const SummaryValue = styled.Text<{ color: string }>`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

export const RingCardRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xlarge}px;
`;

export const LegendColumn = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const LegendRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

export const LegendDot = styled.View<{ color: string }>`
  width: ${RFValue(8)}px;
  height: ${RFValue(8)}px;
  border-radius: ${RFValue(4)}px;
  background-color: ${({ color }) => color};
`;

export const LegendTextGroup = styled.View`
  flex-shrink: 1;
  gap: ${RFValue(1)}px;
`;

export const LegendLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const LegendValue = styled.Text<{ color: string }>`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

export const DotsRow = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: ${RFValue(6)}px;
`;

export const Dot = styled.View<{ active?: boolean }>`
  width: ${RFValue(7)}px;
  height: ${RFValue(7)}px;
  border-radius: ${RFValue(3.5)}px;
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme, active }) => (active ? theme.colors.primary : 'transparent')};
`;
