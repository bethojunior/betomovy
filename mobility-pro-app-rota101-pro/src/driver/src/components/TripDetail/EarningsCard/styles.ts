import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  padding: ${({ theme }) => theme.spacing.large}px;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(8)}px;
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

export const Title = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${RFValue(4)}px 0;
`;

export const RowLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const RowValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.secondary};
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

export const TotalValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xlarge}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const ViewFullCalculationButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${RFValue(8)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${({ theme }) => theme.spacing.large}px;
  margin-top: ${({ theme }) => theme.spacing.xlarge}px;
`;

export const ViewFullCalculationLeft = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(8)}px;
`;

export const ViewFullCalculationText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primaryText};
`;
