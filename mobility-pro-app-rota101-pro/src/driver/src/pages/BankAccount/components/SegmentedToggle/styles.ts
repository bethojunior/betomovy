import styled from 'styled-components/native';

export const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

interface OptionProps {
  selected?: boolean;
}

export const Option = styled.TouchableOpacity<OptionProps>`
  flex-grow: 1;
  flex-basis: 45%;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  border-width: ${({ theme }) => theme.borderWidth.small}px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.white)};
`;

export const OptionText = styled.Text<OptionProps>`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme, selected }) => (selected ? theme.colors.primaryText : theme.colors.secondary)};
`;
