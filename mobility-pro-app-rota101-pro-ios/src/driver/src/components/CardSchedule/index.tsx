import { View } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { useAuth } from '../../../../context/auth';
import Preload from '../../../../components/Preload';
import { convertDatetimeToDate, convertDatetimeToTime } from '../../utils/FormatDate';
import { maskMoney } from '../../utils/money';
import {
  Container,
  PassengerSection,
  Photo,
  AvatarFallback,
  AvatarWrapper,
  PassengerInfo,
  PassengerName,
  TripTypeBadge,
  TripTypeBadgeText,
  DateTimeRow,
  DateTimeItem,
  DateTimeText,
  RouteSection,
  Timeline,
  DotOrigin,
  TimelineLine,
  DotDestination,
  RouteAddresses,
  AddressBlock,
  AddressLabel,
  AddressText,
  Footer,
  PriceBlock,
  PriceLabel,
  PriceValue,
  AcceptButton,
  AcceptButtonText,
  CancelButton,
  CancelButtonText,
} from './styles';
import { translate } from '../../../../client/locales';
import { buildApp } from '../../../../constantBuild/config';
import { aplyDiscount } from '../../../../client/utils/money';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { Trip } from '../../../../interfaces/trip';
import { useCardScheduleActions } from './useCardScheduleActions';
import { useDriverDistanceToOrigin } from '../../hooks/use-driver-distance-to-origin';
import { Fragment } from 'react/jsx-runtime';

const TRIP_TYPE_SHARED = 'COMPARTILHADO';

interface Props {
  trip: Trip;
  onPress?: string;
}

export const CardSchedule = ({ trip, onPress }: Props) => {
  const { cityConfig } = useAuth();
  const theme = useTheme();
  const { getStoragePictureSpecific } = useStoragePictures();
  const { distanceKm } = useDriverDistanceToOrigin(trip);
  const { loading, handleAcceptTrip, handleCancelTrip } = useCardScheduleActions();

  const tripReference = trip?.schedule?.tripReference;
  const tripWayPoints = trip?.tripWayPoints || [];
  const tripType = trip?.tripType || '';
  const isShared = tripType === TRIP_TYPE_SHARED;

  const price = parseFloat(
    String(cityConfig?.showNetValueForDriverOnCall) === '1'
      ? aplyDiscount(trip?.price, trip?.driverCommissionValue, trip?.driverCommissionType)
      : trip?.price,
  );

  const imageUri =
    (getStoragePictureSpecific('customer') || buildApp().HOST_IMAGE_CUSTOMER) +
    trip?.customer?.profileImage;

  const scheduleDate = trip?.schedule?.schedule
    ? convertDatetimeToDate(trip.schedule.schedule)
    : null;
  const scheduleTime = trip?.schedule?.schedule
    ? convertDatetimeToTime(trip.schedule.schedule)
    : null;

  return (
    <Container>
      <Preload visible={loading} />

      {/* Passenger */}
      <PassengerSection>
        <AvatarWrapper>
          {trip?.customer?.profileImage ? (
            <Photo source={{ uri: imageUri }} resizeMode="cover" />
          ) : (
            <AvatarFallback>
              <MaterialIcons name="person" size={26} color="#fff" />
            </AvatarFallback>
          )}
        </AvatarWrapper>

        <PassengerInfo>
          <PassengerName numberOfLines={2}>
            {trip?.customer?.name || translate('tripDriver.passenger_fallback')}
          </PassengerName>
          {tripType ? (
            <TripTypeBadge isShared={isShared}>
              <MaterialIcons
                name={isShared ? 'group' : 'person'}
                size={11}
                color={isShared ? theme.colors.on : theme.colors.primary}
              />
              <TripTypeBadgeText isShared={isShared}>{tripType}</TripTypeBadgeText>
            </TripTypeBadge>
          ) : null}
        </PassengerInfo>
      </PassengerSection>

      {/* Date / time / distance */}
      {scheduleDate || scheduleTime || distanceKm ? (
        <DateTimeRow>
          {scheduleDate ? (
            <DateTimeItem>
              <MaterialIcons
                name="calendar-today"
                size={15}
                color={theme.colors.primary}
              />
              <DateTimeText>{scheduleDate}</DateTimeText>
            </DateTimeItem>
          ) : null}
          {scheduleTime ? (
            <DateTimeItem>
              <Ionicons name="time-outline" size={15} color={theme.colors.primary} />
              <DateTimeText>{scheduleTime}</DateTimeText>
            </DateTimeItem>
          ) : null}
          {distanceKm ? (
            <DateTimeItem>
              <MaterialIcons name="straighten" size={15} color={theme.colors.primary} />
              <DateTimeText>{distanceKm} km</DateTimeText>
            </DateTimeItem>
          ) : null}
        </DateTimeRow>
      ) : null}

      {/* Route */}
      <RouteSection>
        <Timeline>
          <DotOrigin />
          <TimelineLine />
          {tripWayPoints.map((wayPoint, index) => (
            <Fragment key={`${wayPoint?.id}-${index}`}>
              <DotOrigin />
              <TimelineLine />
            </Fragment>
          ))}
          <DotDestination />
        </Timeline>

        <RouteAddresses>
          <AddressBlock>
            <AddressLabel>{translate('tripDriver.origin')}</AddressLabel>
            <AddressText numberOfLines={2}>{trip?.origin?.address || '-'}</AddressText>
          </AddressBlock>

          {tripWayPoints.map((wayPoint, index) => (
            <AddressBlock key={`${wayPoint?.id}-${index}`}>
              <AddressLabel>{translate('tripDriver.waypoint')}</AddressLabel>
              <AddressText numberOfLines={2}>{wayPoint?.address || '-'}</AddressText>
            </AddressBlock>
          ))}

          <AddressBlock>
            <AddressLabel>{translate('tripDriver.destiny')}</AddressLabel>
            <AddressText numberOfLines={2}>{trip?.destination?.name || '-'}</AddressText>
          </AddressBlock>
        </RouteAddresses>
      </RouteSection>

      {/* Footer */}
      <Footer>
        <PriceBlock>
          <PriceLabel>{translate('tripDriver.value')}</PriceLabel>
          <PriceValue>
            {cityConfig?.typeMoney}
            {maskMoney(price)}
          </PriceValue>
        </PriceBlock>

        {!onPress ? (
          <CancelButton
            onPress={() => handleCancelTrip(tripReference)}
            activeOpacity={0.8}
            disabled={loading}
          >
            <CancelButtonText>{translate('tripDriver.cancel')}</CancelButtonText>
          </CancelButton>
        ) : (
          <AcceptButton
            onPress={() => handleAcceptTrip(tripReference)}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <AcceptButtonText>{translate('tripDriver.accept')}</AcceptButtonText>
          </AcceptButton>
        )}
      </Footer>
    </Container>
  );
};
