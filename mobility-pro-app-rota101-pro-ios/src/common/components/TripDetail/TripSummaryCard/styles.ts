import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const Card = styled.View`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  overflow: hidden;
  shadow-color: ${({ theme }) => theme.colors.secondary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 10px;
  elevation: 3;
`;

export const CardContent = styled.View`
  padding: ${({ theme }) => theme.spacing.xlarge}px;
`;

export const TopRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
`;

export const VehicleInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
  flex-shrink: 1;
  margin-right: ${({ theme }) => theme.spacing.medium}px;
`;

export const VehicleInfoText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const StatusBadgeWrapper = styled.View`
  flex-shrink: 0;
`;

export const DateTimeText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.grayLight};
  margin-bottom: ${({ theme }) => theme.spacing.large}px;
`;

export const PriceRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;

export const PriceBlock = styled.View`
  flex: 1;
`;

export const PriceValue = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.xsslarge}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const PriceCaption = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.grayLight};
  margin-top: ${RFValue(2)}px;
`;

export const PaymentChip = styled.View`
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium}px;
  padding: ${RFValue(8)}px ${RFValue(14)}px;
  gap: ${RFValue(2)}px;
`;

export const PaymentChipCaption = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.grayLight};
`;

export const PaymentChipLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;
