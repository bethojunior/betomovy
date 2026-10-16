import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

export const ListWrapper = styled.View`
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const GroupCard = styled.View`
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

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

export const HeaderTextGroup = styled.View`
  flex: 1;
  gap: ${RFValue(2)}px;
`;

export const DateText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const TripRefRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small}px;
`;

export const TripRefLabel = styled.Text`
  flex-shrink: 1;
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  color: ${({ theme }) => theme.colors.grayLight};
`;

export const PaymentBadge = styled.View<{ background: string }>`
  padding: ${RFValue(3)}px ${({ theme }) => theme.spacing.medium}px;
  border-radius: ${({ theme }) => theme.borderRadius.xxxlarge}px;
  background-color: ${({ background }) => background};
`;

export const PaymentBadgeText = styled.Text<{ color: string }>`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
`;

export const SubRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const SubIcon = styled.View`
  width: ${RFValue(18)}px;
  align-items: center;
`;

export const SubDescription = styled.Text`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const SubValue = styled.Text<{ color: string }>`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ color }) => color};
`;

export const StandaloneRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}px;
`;

export const StandaloneIcon = styled.View`
  width: ${RFValue(20)}px;
  align-items: center;
`;

export const StandaloneTextGroup = styled.View`
  flex: 1;
`;

export const StandaloneTitle = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const EmptyText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xlarge}px 0;
`;
