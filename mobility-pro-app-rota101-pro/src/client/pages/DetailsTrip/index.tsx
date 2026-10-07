import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { decode } from '@googlemaps/polyline-codec';

import apiMain from '../../api/apiMain';
import { translate } from '../../locales';
import { maskMoneyIntl } from '../../utils/money';
import { convertDate, maskHour } from '../../utils/FormatDate';
import { customToast } from '../../../utils/FlashMessage';
import { useAuth } from '../../../context/auth';
import { useFavorite } from '../../contexts/favorite';
import { useReceipt } from '../../contexts/Receipt';
import Preload from '../../components/Preload';
import Helper from '../../utils/Helper';
import { STATUS_CANCELED, STATUS_SCHEDULED } from '../../constants/trip';

import { StatusBadgeVariant } from '../../../common/components/TripDetail/StatusBadge/types';
import { Coordinate } from '../../../common/components/TripDetail/TripMap/types';
import { TripSummaryCard } from '../../../common/components/TripDetail/TripSummaryCard';
import { TripMap } from '../../../common/components/TripDetail/TripMap';
import { DistanceDurationCard } from '../../../common/components/TripDetail/DistanceDurationCard';
import { AddressTimeline } from '../../../common/components/TripDetail/AddressTimeline';
import { PartnerCard } from '../../../common/components/TripDetail/PartnerCard';
import { CollapsibleBreakdownCard } from '../../../common/components/TripDetail/CollapsibleBreakdownCard';
import { ReportProblemButton } from '../../../common/components/TripDetail/ReportProblemButton';
import { ReportProblemModal } from '../../components/TripDetail/ReportProblemModal';

import {
  ActionButton,
  ActionButtonText,
  ActionsRow,
  CarInfoText,
  Container,
  Content,
  CancelScheduledButton,
  CancelScheduledButtonText,
  ErrorContainer,
  ErrorSubtitle,
  ErrorTitle,
  FavoriteBlockButton,
  FavoriteBlockRow,
  FavoriteBlockText,
  RetryButton,
  RetryButtonText,
} from './styles';
import { DetailsTripRouteParams, TripDetailsResponse } from './types';
import { useSupportNumber } from '~/hooks/useSupportNumber';

const STATUS_VARIANT: Record<string, StatusBadgeVariant> = {
  FINISHED: 'success',
  CANCELED: 'error',
  IN_PROGRESS: 'warning',
  SCHEDULED: 'neutral',
  BACK_OFF: 'neutral',
  NOT_ANSWERED: 'neutral',
};

const switchStatus = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return translate('service.scheduled');
    case 'IN_PROGRESS':
      return translate('request.text_in_progress');
    case 'FINISHED':
      return translate('service.finished');
    case 'CANCELED':
      return translate('service.cancel');
    case 'BACK_OFF':
      return translate('service.not_answered');
    case 'NOT_ANSWERED':
      return translate('service.not_answered');
    default:
      return '';
  }
};

const formatDateAndHour = (date: string) => {
  const dateSplit = date?.split(' ');
  return { dateLabel: convertDate(dateSplit[0]), timeLabel: maskHour(dateSplit[1]) };
};

export const DetailsTrip = ({ route }: any) => {
  const { tripReference, trip }: DetailsTripRouteParams = route.params;
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { addFavorites, removeFavorites, getFavorites, favorites } = useFavorite();
  const { sendReceipt } = useReceipt();
  const { getSupportNumberFormatted } = useSupportNumber();

  const [detailsTrip, setDetailsTrip] = useState<TripDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [sendingReceipt, setSendingReceipt] = useState(false);
  const [driverBlocked, setDriverBlocked] = useState<any>(null);
  const [modalReport, setModalReport] = useState(false);
  const [cancellingSchedule, setCancellingSchedule] = useState(false);

  const getDetailsTrip = async (reference: string) => {
    setLoading(true);
    setHasError(false);
    try {
      const response = await apiMain.post('Trip/Get', { stdObject: [{ tripReference: reference }] });

      if (!response.data.status || !response.data.data) {
        setHasError(true);
        return;
      }

      setDetailsTrip(response.data.data);

      const driverId = response?.data?.data?.driver?.idDriver;
      if (driverId) {
        const { data } = await apiMain.post('/RefusedDriver/list', { customerId: user.idCustomer });
        setDriverBlocked(data?.data?.find((item: any) => item.idDriver === driverId) ?? null);
      }
    } catch (error) {
      console.log(error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailsTrip(tripReference);
    getFavorites();
  }, []);

  const favoriteRecord = favorites.find(item => String(item.idDriver) === String(detailsTrip?.driver?.idDriver));
  const isFavorited = !!favoriteRecord;

  const toggleFavorite = async () => {
    if (!detailsTrip?.driver) return;
    if (isFavorited) {
      await removeFavorites(String(favoriteRecord.idFavorite));
    } else {
      await addFavorites(user.idCustomer, Number(detailsTrip.driver.idDriver));
    }
    await getFavorites();
  };

  const toggleBlockDriver = () => {
    if (!detailsTrip?.driver) return;

    if (!driverBlocked) {
      return Alert.alert(
        translate('detailsTrip.blocked_driver'),
        translate('detailsTrip.text_dialog_blocked'),
        [
          { text: translate('detailsTrip.text_button_no'), style: 'cancel' },
          {
            text: translate('detailsTrip.text_button_yes'),
            onPress: async () => {
              const response = await apiMain.post('RefusedDriver/Insert', {
                driverId: detailsTrip.driver.idDriver,
                customerId: user.idCustomer,
              });
              if (!response.data.status) {
                return customToast(response.data.message, 'danger');
              }
              setDriverBlocked({ idDriver: detailsTrip.driver.idDriver });
              customToast(translate('detailsTrip.text_sucess_blocked'), 'success');
            },
          },
        ],
        { cancelable: false },
      );
    }

    return Alert.alert(
      translate('detailsTrip.unlock_driver'),
      translate('detailsTrip.text_dialog_unlock'),
      [
        { text: translate('detailsTrip.text_button_no'), style: 'cancel' },
        {
          text: translate('detailsTrip.text_button_yes'),
          onPress: async () => {
            const response = await apiMain.post('RefusedDriver/Delete', { idRefused: driverBlocked.id });
            if (!response.data.status) {
              return customToast(response.data.message, 'danger');
            }
            setDriverBlocked(null);
            customToast(translate('detailsTrip.text_sucess_unlock'), 'success');
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleSendReceipt = async () => {
    setSendingReceipt(true);
    await sendReceipt(tripReference);
    setSendingReceipt(false);
  };

  const handleCancelScheduledTrip = async () => {
    setCancellingSchedule(true);
    const { data } = await apiMain.post('Customer/CancelTrip', {
      stdObject: [
        {
          status: STATUS_CANCELED,
          userId: user.idUser,
          tripReference,
          dateEnd: Helper.getNow(),
        },
      ],
    });
    setCancellingSchedule(false);

    if (!data.status) {
      return customToast(data.message, 'danger');
    }

    customToast(translate('service.toast_sucess'), 'success');
    navigation.navigate('TripRoutes', { screen: 'Home' });
  };

  const handleAskForHelp = () => {
    const phoneNumber = getSupportNumberFormatted();
    if (!phoneNumber) {
      return customToast(translate('detailsTrip.support_number_not_configured'), 'warning');
    }
    Linking.openURL(`https://wa.me/${phoneNumber}`);
  };

  const showContent = !loading && !hasError && detailsTrip;
  const showError = !loading && hasError;

  const tracingCoordinates: Coordinate[] = detailsTrip?.routeTracing
    ? decode(detailsTrip.routeTracing).map(([latitude, longitude]) => ({ latitude, longitude }))
    : [];

  const routeCoordinates: Coordinate[] =
    tracingCoordinates.length > 0
      ? tracingCoordinates
      : detailsTrip?.location && detailsTrip.location.length > 0
        ? detailsTrip.location.map(point => ({
          latitude: Number(point.latitude),
          longitude: Number(point.longitude),
        }))
        : detailsTrip
          ? [
            { latitude: Number(detailsTrip.origin.latitude), longitude: Number(detailsTrip.origin.longitude) },
            { latitude: Number(detailsTrip.destination.latitude), longitude: Number(detailsTrip.destination.longitude) },
          ]
          : [];

  const statusKey = trip?.status?.toUpperCase() ?? '';
  const { dateLabel, timeLabel } = formatDateAndHour(trip?.schedule ? trip.schedule.schedule : trip?.date);

  const grossPrice = detailsTrip?.financialBreakdown?.grossPrice ?? Number(trip?.price ?? 0);
  const netValue = detailsTrip?.financialBreakdown?.netValue ?? null;
  const platformAmount = netValue != null ? grossPrice - netValue : null;

  const carInfo = [detailsTrip?.driver?.car?.model, detailsTrip?.driver?.car?.plate]
    .filter(Boolean)
    .join(' • ');

  return (
    <Container>
      <Preload visible={loading || sendingReceipt} />

      {showContent && (
        <Content>
          <TripSummaryCard
            vehicleTypeLabel={detailsTrip.tripCallType ?? ''}
            dateLabel={dateLabel}
            timeLabel={timeLabel}
            statusLabel={switchStatus(statusKey)}
            statusVariant={STATUS_VARIANT[statusKey] ?? 'neutral'}
            priceLabel={maskMoneyIntl(grossPrice)}
            priceCaption={translate('detailsTrip.you_paid_this_trip')}
            paymentMethodLabel={trip.paymentForm}
            paymentMethodCaption={translate('detailsTrip.text_type_payment')}
          >
            <TripMap
              origin={
                detailsTrip.origin.latitude
                  ? { latitude: Number(detailsTrip.origin.latitude), longitude: Number(detailsTrip.origin.longitude) }
                  : null
              }
              destination={
                detailsTrip.destination.latitude
                  ? {
                    latitude: Number(detailsTrip.destination.latitude),
                    longitude: Number(detailsTrip.destination.longitude),
                  }
                  : null
              }
              routeCoordinates={routeCoordinates}
              originLabel={translate('myTravels.boarding')}
              destinationLabel={translate('myTravels.destination')}
            />
          </TripSummaryCard>

          {(detailsTrip.distance || detailsTrip.estimatedTripTime) && (
            <DistanceDurationCard
              distanceLabel={`${parseFloat(detailsTrip.distance ?? '0').toFixed(1)} km`}
              distanceCaption={translate('myTravels.distance')}
              durationLabel={
                detailsTrip.ride
                  ? `${(Number(detailsTrip.estimatedTripTime) / 60).toFixed(0)} min`
                  : `${detailsTrip.estimatedTripTime} min`
              }
              durationCaption={translate('myTravels.duration')}
            />
          )}

          <AddressTimeline
            origin={{ label: translate('myTravels.boarding'), primaryText: trip.originAddress }}
            waypoints={detailsTrip.tripWayPoints?.map((wayPoint, index) => ({
              label: `${translate('myTravels.stop')} ${index + 1}`,
              primaryText: wayPoint.address,
            }))}
            stopsToggleLabel={
              detailsTrip.tripWayPoints?.length
                ? `+${detailsTrip.tripWayPoints.length} ${
                  detailsTrip.tripWayPoints.length === 1
                    ? translate('myTravels.stop')
                    : translate('myTravels.stops')
                }`
                : undefined
            }
            destination={{ label: translate('myTravels.destination'), primaryText: trip.destinationAddress }}
          />

          {detailsTrip.driver && (
            <PartnerCard
              label={translate('myTravels.driver')}
              name={detailsTrip.driver.nickname ?? detailsTrip.driver.name ?? ''}
              photoUrl={detailsTrip.driver.profilePicture}
            >
              {!!carInfo && <CarInfoText>{carInfo}</CarInfoText>}

              <FavoriteBlockRow>
                <FavoriteBlockButton activeOpacity={0.7} onPress={toggleFavorite}>
                  <FontAwesome5 name="heart" solid={isFavorited} size={RFValue(13)} color={theme.colors.red} />
                  <FavoriteBlockText>
                    {isFavorited
                      ? translate('favorites.text_button_isfavorited')
                      : translate('favorites.text_button_favorite')}
                  </FavoriteBlockText>
                </FavoriteBlockButton>

                <FavoriteBlockButton activeOpacity={0.7} onPress={toggleBlockDriver}>
                  <FontAwesome5 name="ban" size={RFValue(13)} color={theme.colors.red} />
                  <FavoriteBlockText>
                    {driverBlocked ? translate('detailsTrip.unlock') : translate('detailsTrip.blocked')}
                  </FavoriteBlockText>
                </FavoriteBlockButton>
              </FavoriteBlockRow>
            </PartnerCard>
          )}

          <CollapsibleBreakdownCard
            icon="wallet"
            title={translate('trip.senacon_title')}
            totalPosition="top"
            totalLabel={translate('trip.senacon_total')}
            totalValueLabel={maskMoneyIntl(grossPrice)}
            rows={[
              { label: translate('trip.senacon_platform'), valueLabel: platformAmount != null ? maskMoneyIntl(platformAmount) : '—' },
              { label: translate('trip.senacon_driver'), valueLabel: netValue != null ? maskMoneyIntl(netValue) : '—' },
            ]}
            disclaimer={translate('trip.senacon_disclaimer')}
          />

          <ActionsRow>
            <ActionButton activeOpacity={0.7} onPress={handleAskForHelp}>
              <FontAwesome5 name="headset" size={RFValue(14)} color={theme.colors.primaryText} />
              <ActionButtonText>{translate('detailsTrip.need_help')}</ActionButtonText>
            </ActionButton>

            <ActionButton activeOpacity={0.7} onPress={handleSendReceipt}>
              <FontAwesome5 name="file-invoice" size={RFValue(14)} color={theme.colors.primaryText} />
              <ActionButtonText>{translate('detailsTrip.send_receipt')}</ActionButtonText>
            </ActionButton>
          </ActionsRow>

          {statusKey === STATUS_SCHEDULED.toUpperCase() && (
            <CancelScheduledButton
              activeOpacity={0.7}
              onPress={handleCancelScheduledTrip}
              disabled={cancellingSchedule}
            >
              {cancellingSchedule ? (
                <ActivityIndicator size="small" color={theme.colors.primaryText} />
              ) : (
                <>
                  <FontAwesome5 name="times-circle" size={RFValue(14)} color={theme.colors.primaryText} />
                  <CancelScheduledButtonText>{translate('service.text_button_cancel')}</CancelScheduledButtonText>
                </>
              )}
            </CancelScheduledButton>
          )}

          <ReportProblemButton
            label={translate('myTravels.report_problem_this_trip')}
            onPress={() => setModalReport(true)}
          />
        </Content>
      )}

      {showError && (
        <ErrorContainer>
          <FontAwesome5 name="exclamation-circle" size={RFValue(32)} color={theme.colors.primary} />
          <ErrorTitle>{translate('detailsTrip.error_loading_title')}</ErrorTitle>
          <ErrorSubtitle>{translate('detailsTrip.error_loading_subtitle')}</ErrorSubtitle>
          <RetryButton activeOpacity={0.7} onPress={() => getDetailsTrip(tripReference)}>
            <FontAwesome5 name="redo" size={RFValue(12)} color={theme.colors.white} />
            <RetryButtonText>{translate('detailsTrip.retry')}</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      )}

      <ReportProblemModal visible={modalReport} setVisible={setModalReport} tripReference={tripReference} />
    </Container>
  );
};
