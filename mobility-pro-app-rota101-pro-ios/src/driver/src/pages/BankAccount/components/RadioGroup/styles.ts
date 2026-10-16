import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const OptionRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

interface DotProps {
  selected?: boolean;
}

export const RadioDot = styled.View<DotProps>`
  width: ${RFValue(16)}px;
  height: ${RFValue(16)}px;
  border-radius: ${RFValue(8)}px;
  border-width: ${RFValue(1.5)}px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};
  align-items: center;
  justify-content: center;
`;

export const RadioDotFill = styled.View`
  width: ${RFValue(8)}px;
  height: ${RFValue(8)}px;
  border-radius: ${RFValue(4)}px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const OptionLabel = styled.Text<DotProps>`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme, selected }) => (selected ? theme.colors.secondary : theme.colors.text_gray)};
  font-weight: ${({ selected }) => (selected ? 700 : 400)};
`;
