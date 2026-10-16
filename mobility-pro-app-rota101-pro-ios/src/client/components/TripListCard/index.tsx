import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { convertDate, maskHour } from '../../utils/FormatDate';
import { maskMoneyIntl } from '../../utils/money';
import { translate } from '../../locales';
import { STATUS_SCHEDULED } from '../../constants/trip';
import {
  getPaymentIcon,
  getStatusVariant,
  STATUS_ICON,
  switchTripStatusLabel,
} from '../../../common/components/TripListCard/utils';
import { TripListCardProps } from './types';
import {
  AddressBlocks,
  AddressIconsColumn,
  AddressLabel,
  AddressLine,
  AddressPoint,
  AddressRow,
  AddressText,
  Badge,
  BadgeText,
  Card,
  DateVehicleRow,
  DateVehicleText,
  Divider,
  HeaderRow,
  PaymentRow,
  PaymentText,
  PriceRow,
  PriceText,
  ScheduleByText,
  StatusPaymentRow,
  VehicleTypeRow,
  VehicleTypeText,
} from './styles';

const formatDateAndHour = (date: string) => {
  const dateSplit = date?.split(' ');
  return `${convertDate(dateSplit[0])} ${maskHour(dateSplit[1])}`;
};

export function TripListCard({ trip, isSpeedMob }: TripListCardProps) {
  const navigation = useNavigation();
  const theme = useTheme();

  const status = trip?.status?.toUpperCase() ?? '';
  const variant = getStatusVariant(status);
  const isCanceled = status === 'CANCELED';
  const paymentIcon = getPaymentIcon(trip.paymentForm);
  const isScheduledWithDriver = trip.status === STATUS_SCHEDULED && !!trip.driverName;

  const handlePress = () => {
    (navigation as any).navigate(isSpeedMob ? 'DetailsTripSpeedMob' : 'DetailsTrip', {
      tripReference: trip.tripReference,
      trip,
    });
  };

  return (
    <Card isCanceled={isCanceled} activeOpacity={0.8} onPress={handlePress}>
      <HeaderRow>
        <DateVehicleRow>
          <FontAwesome5 name="calendar-alt" size={RFValue(12)} color={theme.colors.primary} />
          <DateVehicleText numberOfLines={1}>
            {trip.schedule ? formatDateAndHour(trip.schedule.schedule) : formatDateAndHour(trip.date)}
          </DateVehicleText>
        </DateVehicleRow>

        <PriceRow>
          <PriceText>{maskMoneyIntl(trip.price)}</PriceText>
          <FontAwesome5 name="chevron-right" size={RFValue(12)} color={theme.colors.text_gray} />
        </PriceRow>
      </HeaderRow>

      {trip.type && (
        <VehicleTypeRow>
          <VehicleTypeText numberOfLines={1}>{trip.type}</VehicleTypeText>
        </VehicleTypeRow>
      )}

      <StatusPaymentRow>
        <Badge variant={variant}>
          <FontAwesome5 name={STATUS_ICON[variant]} solid size={RFValue(9)} color={theme.colors.secondary} />
          <BadgeText variant={variant}>{switchTripStatusLabel(status)}</BadgeText>
        </Badge>

        <PaymentRow>
          {paymentIcon.pack === 'fa5' ? (
            <FontAwesome5 name={paymentIcon.name} size={RFValue(11)} color={theme.colors.primary} />
          ) : (
            <MaterialCommunityIcons name={paymentIcon.name as any} size={RFValue(13)} color={theme.colors.primary} />
          )}
          <PaymentText>
            {translate('service.payment_by')} {trip.paymentForm}
          </PaymentText>
        </PaymentRow>
      </StatusPaymentRow>

      {isScheduledWithDriver && (
        <ScheduleByText>
          {translate('service.schedule_by')} {trip.driverName}
        </ScheduleByText>
      )}

      <Divider />

      <AddressRow>
        <AddressIconsColumn>
          <Ionicons name="ellipse" size={RFValue(12)} color={theme.colors.border_green} />
          <AddressLine />
          <Ionicons name="location" size={RFValue(14)} color={theme.colors.primary} />
        </AddressIconsColumn>

        <AddressBlocks>
          <AddressBlock label={translate('finishTrip.text_boarding')} text={trip.originAddress} />
          <AddressBlock label={translate('finishTrip.text_destination')} text={trip.destinationAddress} />
        </AddressBlocks>
      </AddressRow>
    </Card>
  );
}

function AddressBlock({ label, text }: { label: string; text?: string }) {
  return (
    <AddressPoint>
      <AddressLabel>{label}</AddressLabel>
      <AddressText numberOfLines={2}>{text || '-'}</AddressText>
    </AddressPoint>
  );
}
