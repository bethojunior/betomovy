import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { TripStatusVariant } from './types';

export const Card = styled.TouchableOpacity<{ isCanceled?: boolean }>`
  background-color: ${({ theme, isCanceled }) =>
    isCanceled ? theme.colors.redLight : theme.colors.background_white};
  border-radius: ${({ theme }) => theme.borderRadius.large}px;
  border-width: ${({ isCanceled }) => (isCanceled ? 1 : 0)}px;
  border-color: ${({ theme }) => theme.colors.red};
  padding: ${({ theme }) => theme.spacing.xlarge}px;
  margin: ${({ theme }) => theme.spacing.medium}px ${({ theme }) => theme.spacing.large}px;
  shadow-color: ${({ theme }) => theme.colors.secondary};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.08;
  shadow-radius: 6px;
  elevation: 3;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const DateVehicleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
  flex-shrink: 1;
  margin-right: ${({ theme }) => theme.spacing.medium}px;
`;

export const DateVehicleText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.medium}px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const PriceRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
  flex-shrink: 0;
`;

export const VehicleTypeRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
  margin-top: ${({ theme }) => theme.spacing.medium}px;
`;

export const VehicleTypeText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const PriceText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const StatusPaymentRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.large}px;
  flex-wrap: wrap;
  gap: ${RFValue(6)}px;
`;

const BADGE_BACKGROUND: Record<TripStatusVariant, string> = {
  success: 'background_greenLight',
  error: 'redLight',
  warning: 'yellowLight',
};

export const Badge = styled.View<{ variant: TripStatusVariant }>`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
  background-color: ${({ theme, variant }) => (theme.colors as any)[BADGE_BACKGROUND[variant]]};
  border-radius: ${({ theme }) => theme.borderRadius.xxlarge}px;
  padding: ${RFValue(4)}px ${({ theme }) => theme.spacing.medium}px;
`;

const BADGE_TEXT_COLOR: Record<TripStatusVariant, string> = {
  success: 'border_green',
  error: 'red',
  warning: 'text_gray',
};

export const BadgeText = styled.Text<{ variant: TripStatusVariant }>`
  font-size: ${({ theme }) => theme.fontSizes.small}px;
  font-weight: 700;
  color: ${({ theme, variant }) => (theme.colors as any)[BADGE_TEXT_COLOR[variant]]};
`;

export const PaymentRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
`;

export const PaymentText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
`;

export const ScheduleByText = styled(PaymentText)`
  margin-top: ${({ theme }) => theme.spacing.small}px;
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.large}px 0;
`;

export const AddressRow = styled.View`
  flex-direction: row;
`;

export const AddressIconsColumn = styled.View`
  align-items: center;
  padding-top: ${RFValue(2)}px;
  margin-right: ${({ theme }) => theme.spacing.medium}px;
`;

export const AddressLine = styled.View`
  width: 1px;
  flex: 1;
  min-height: ${RFValue(20)}px;
  border-left-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  border-style: dashed;
  margin: ${RFValue(4)}px 0;
`;

export const AddressBlocks = styled.View`
  flex: 1;
  gap: ${({ theme }) => theme.spacing.large}px;
`;

export const AddressPoint = styled.View``;

export const AddressLabel = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${RFValue(2)}px;
`;

export const AddressText = styled.Text`
  font-size: ${({ theme }) => theme.fontSizes.smalls}px;
  color: ${({ theme }) => theme.colors.text_gray};
  line-height: ${RFValue(16)}px;
`;
