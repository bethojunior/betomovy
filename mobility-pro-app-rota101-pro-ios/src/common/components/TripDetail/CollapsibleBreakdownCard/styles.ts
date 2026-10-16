import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const HeaderRow = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(8)}px;
`;

export const Title = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Caption = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const Content = styled.View`
  margin-top: ${({ theme }) => theme.spacing.large}px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${RFValue(4)}px 0;
`;

export const RowLabel = styled.Text`
  flex: 1;
  padding-right: ${({ theme }) => theme.spacing.medium}px;
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const RowValue = styled.Text<{ color?: string }>`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme, color }) => color ?? theme.colors.secondary};
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.medium}px 0;
`;

export const TotalLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const TotalValue = styled.Text<{ color: string }>`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

export const Disclaimer = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.grayLight};
  margin-top: ${({ theme }) => theme.spacing.medium}px;
`;
