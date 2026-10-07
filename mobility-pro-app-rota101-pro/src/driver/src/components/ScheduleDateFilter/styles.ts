import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { readableTextColor } from '~/utils/color';

export const Card = styled.View`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.small}px;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const PeriodLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
`;

export const ChipRow = styled.View`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const Chip = styled.TouchableOpacity<{ active?: boolean }>`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.xxxlarge}px;
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primary : 'transparent'};
  padding: ${RFValue(8)}px ${RFValue(12)}px;
`;

export const ChipText = styled.Text<{ active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme, active }) =>
    active ? readableTextColor(theme.colors.primary) : theme.colors.secondary};
  text-wrap: nowrap;
`;

export const DateRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const DateButton = styled.TouchableOpacity<{ active?: boolean }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${RFValue(6)}px;
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.border};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primary : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${RFValue(8)}px;
`;

export const DateButtonText = styled.Text<{ active?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme, active }) =>
    active ? readableTextColor(theme.colors.primary) : theme.colors.secondary};
`;

export const CalendarSheetContent = styled.View`
  padding: 0 ${({ theme }) => theme.spacing.medium}px
    ${({ theme }) => theme.spacing.large}px;
`;
