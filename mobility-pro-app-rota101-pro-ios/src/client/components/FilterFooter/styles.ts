import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { rgba } from 'polished';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.medium}px ${({ theme }) => theme.spacing.large}px;
`;

export const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${RFValue(8)}px ${({ theme }) => theme.spacing.large}px;
  background-color: ${({ theme }) => theme.colors.background_white};
`;

export const FilterButtonText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const PaginationRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
  background-color: ${({ theme }) => theme.colors.background_white};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${RFValue(4)}px;
`;

export const PaginationButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: ${RFValue(26)}px;
  height: ${RFValue(26)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${RFValue(13)}px;
  background-color: ${({ theme }) => theme.colors.background_white_light};
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
`;

export const PaginationLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0 ${RFValue(6)}px;
`;

export const FilterOptionsList = styled.View`
  padding: 0 ${({ theme }) => theme.spacing.xlarge}px ${({ theme }) => theme.spacing.large}px;
`;

export const FilterOptionRow = styled.TouchableOpacity<{ selected?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
  background-color: ${({ theme, selected }) => (selected ? rgba(theme.colors.primary, 0.08) : 'transparent')};
`;

export const FilterOptionRadio = styled.View<{ selected?: boolean }>`
  width: ${RFValue(18)}px;
  height: ${RFValue(18)}px;
  border-radius: ${RFValue(9)}px;
  border-width: 2px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  align-items: center;
  justify-content: center;
`;

export const FilterOptionRadioDot = styled.View`
  width: ${RFValue(9)}px;
  height: ${RFValue(9)}px;
  border-radius: ${RFValue(5)}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const FilterOptionLabel = styled.Text<{ selected?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: ${({ selected }) => (selected ? '700' : '400')};
  color: ${({ theme }) => theme.colors.secondary};
`;
