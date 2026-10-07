import { FC } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { StatusBadge } from '../StatusBadge';
import { TripSummaryCardProps } from './types';
import {
  Card,
  CardContent,
  DateTimeText,
  PaymentChip,
  PaymentChipCaption,
  PaymentChipLabel,
  PriceBlock,
  PriceCaption,
  PriceRow,
  PriceValue,
  StatusBadgeWrapper,
  TopRow,
  VehicleInfo,
  VehicleInfoText,
} from './styles';

export const TripSummaryCard: FC<TripSummaryCardProps> = ({
  vehicleTypeLabel,
  dateLabel,
  timeLabel,
  statusLabel,
  statusVariant,
  priceLabel,
  priceCaption,
  paymentMethodLabel,
  paymentMethodCaption,
  children,
}) => {
  const theme = useTheme();

  return (
    <Card>
      <CardContent>
        <TopRow>
          <VehicleInfo>
            <FontAwesome5 name="car-side" size={RFValue(12)} color={theme.colors.primary} />
            <VehicleInfoText numberOfLines={1} ellipsizeMode="tail">
              {vehicleTypeLabel}
            </VehicleInfoText>
          </VehicleInfo>
          <StatusBadgeWrapper>
            <StatusBadge label={statusLabel} variant={statusVariant} />
          </StatusBadgeWrapper>
        </TopRow>

        <DateTimeText numberOfLines={1}>
          {dateLabel} • {timeLabel}
        </DateTimeText>

        <PriceRow>
          <PriceBlock>
            <PriceValue>{priceLabel}</PriceValue>
            <PriceCaption>{priceCaption}</PriceCaption>
          </PriceBlock>

          <PaymentChip>
            <FontAwesome5 name="wallet" size={RFValue(12)} color={theme.colors.secondary} />
            <PaymentChipCaption>{paymentMethodCaption}</PaymentChipCaption>
            <PaymentChipLabel>{paymentMethodLabel}</PaymentChipLabel>
          </PaymentChip>
        </PriceRow>
      </CardContent>

      {children}
    </Card>
  );
};
