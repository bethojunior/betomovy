import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { decode } from '@googlemaps/polyline-codec';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

import apiMain from '../../api/apiMain';
import theme from '../../styles/theme';
import {
  STATUS_CANCELED,
  STATUS_RELEASED_AFTER_ANALISYS,
  STATUS_SITUATION_RELEASED,
  STATUS_SITUATION_RELEASED_AUTOMATICALLY,
} from '../../constants/trip';
import { convertDate, maskHour, getEstimatedTripTimeInMinutes } from '../../utils/FormatDate';
import { translate } from '../../../../client/locales';
import Preload from '../../components/Preload';
import Helper from '../../utils/Helper';
import { useAuth } from '../../../../context/auth';
import HelpMethodModal from '../../components/HelpMethodModal';
import { useUserDriver } from '../../context/userDriver';
import { bubble } from '../Home/service';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { buildApp } from '../../../../constantBuild/config';

import { StatusBadgeVariant } from '../../components/TripDetail/StatusBadge/types';
import { Coordinate } from '../../components/TripDetail/TripMap/types';
import { EarningsRow } from '../../components/TripDetail/EarningsCard/types';
import { TripSummaryCard } from '../../components/TripDetail/TripSummaryCard';
import { TripMap } from '../../components/TripDetail/TripMap';
import { DistanceDurationCard } from '../../components/TripDetail/DistanceDurationCard';
import { AddressTimeline } from '../../components/TripDetail/AddressTimeline';
import { PartnerCard } from '../../components/TripDetail/PartnerCard';
import { ReportProblemButton } from '../../../../common/components/TripDetail/ReportProblemButton';
import { EarningsCard } from '../../components/TripDetail/EarningsCard';
import { useTripFareBreakdown } from '../../hooks/useTripFareBreakdown';

import {
  Container,
  Content,
  ErrorContainer,
  ErrorSubtitle,
  ErrorTitle,
  ReportProblemButtonWrapper,
  RetryButton,
  RetryButtonText,
} from './styles';
import { DetailsTripRouteParams, TripDetailsResponse } from './types';

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
  const navigation = useNavigation();
  const { cityConfig, generalSettings } = useAuth();
  const { userDriverFind } = useUserDriver();
  const { getStoragePictureSpecific } = useStoragePictures();

  const [detailsTrip, setDetailsTrip] = useState<TripDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);

  const getDetailsTrip = async (reference: string) => {
    setLoading(true);
    setHasError(false);
    try {
      const response = await apiMain.post('Trip/Get', {
        stdObject: [{ tripReference: reference }],
      });

      if (!response.data.status || !response.data.data) {
        setHasError(true);
        return;
      }

      setDetailsTrip(response.data.data);
    } catch (error) {
      console.log(error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailsTrip(tripReference);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const reactivateBubbleIfNeeded = async () => {
        try {
          if (userDriverFind?.status === 'disponivel') {
            await bubble(
              userDriverFind?.idDriver,
              theme,
              cityConfig?.showNetValueForDriverOnCall,
              Helper.generalSettingsValue(generalSettings, 'show_more_calcs_driver'),
              Helper.generalSettingsActive(generalSettings, 'enable_realtime_socket'),
              cityConfig,
            );
          }
        } catch (error) {
          console.log('Erro ao reativar bubble:', error);
        }
      };

      reactivateBubbleIfNeeded();
    }, [userDriverFind?.status, cityConfig, generalSettings]),
  );

  const distanceValue = parseFloat(detailsTrip?.distance ?? '0');
  const fareBreakdown = useTripFareBreakdown(detailsTrip, distanceValue);

  const showContent = !loading && !hasError && detailsTrip;
  const showError = !loading && hasError;

  // routeTracing (polyline do trajeto real) > location (pontos de GPS brutos) > linha reta origem-destino
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
            {
              latitude: Number(detailsTrip.origin.latitude),
              longitude: Number(detailsTrip.origin.longitude),
            },
            {
              latitude: Number(detailsTrip.destination.latitude),
              longitude: Number(detailsTrip.destination.longitude),
            },
          ]
          : [];

  const statusKey = trip?.status?.toUpperCase() ?? '';
  const { dateLabel, timeLabel } = formatDateAndHour(trip?.schedule ? trip.schedule.schedule : trip?.date);

  const cancelations = detailsTrip?.cancellationFee_paid ? detailsTrip.cancellationFee_paid.split(',') : [];

  const isMileageEnabled = Helper.generalSettingsActive(generalSettings, 'enable_transform_km_for_mi');

  const earningsRows: EarningsRow[] = [
    {
      label: translate('myTravels.base_price'),
      valueLabel: `${cityConfig?.typeMoney}${Helper.maskMoney(fareBreakdown.basePrice)}`,
    },
    {
      label: translate(isMileageEnabled ? 'myTravels.mi_price' : 'myTravels.km_price'),
      valueLabel: `${cityConfig?.typeMoney}${Helper.maskMoney(fareBreakdown.distancePrice)}`,
    },
    {
      label: translate('myTravels.minute_price'),
      valueLabel: `${cityConfig?.typeMoney}${Helper.maskMoney(fareBreakdown.timePrice)}`,
    },
    ...cancelations.map((value, index) => ({
      label: `${translate('myTravels.fee')} ${index + 1}`,
      valueLabel: `${cityConfig?.typeMoney}${Helper.maskMoney(Number(value))}`,
    })),
  ];

  const customerPhotoUrl = detailsTrip?.customer?.profileImage
    ? `${getStoragePictureSpecific('customer') || buildApp().HOST_IMAGE_CUSTOMER}${detailsTrip.customer.profileImage}`
    : null;

  const canReportProblem =
    trip?.tripAuditId !== String(STATUS_SITUATION_RELEASED) &&
    trip?.tripAuditId !== String(STATUS_RELEASED_AFTER_ANALISYS) &&
    trip?.tripAuditId !== String(STATUS_SITUATION_RELEASED_AUTOMATICALLY);

  return (
    <Container>
      <Preload visible={loading} />

      {showContent && (
        <Content>
          <TripSummaryCard
            vehicleTypeLabel={detailsTrip.tripCallType ?? ''}
            dateLabel={dateLabel}
            timeLabel={timeLabel}
            statusLabel={switchStatus(statusKey)}
            statusVariant={STATUS_VARIANT[statusKey] ?? 'neutral'}
            priceLabel={`${cityConfig?.typeMoney}${Helper.maskMoney(
              Number(detailsTrip?.financialBreakdown?.grossPrice ?? trip.price),
            )}`}
            priceCaption={translate('detailsTrip.text_total')}
            paymentMethodLabel={trip.paymentForm}
            paymentMethodCaption={translate('detailsTrip.text_type_payment')}
          >
            <TripMap
              origin={
                detailsTrip.origin.latitude
                  ? {
                    latitude: Number(detailsTrip.origin.latitude),
                    longitude: Number(detailsTrip.origin.longitude),
                  }
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
              originLabel="Localização Atual"
              destinationLabel="Chegada"
            />
          </TripSummaryCard>

          <DistanceDurationCard
            distanceLabel={Helper.kmToMiles(parseFloat(detailsTrip.distance).toFixed(3), isMileageEnabled)}
            distanceCaption={translate('myTravels.distance')}
            durationLabel={`${getEstimatedTripTimeInMinutes(detailsTrip).toFixed(0)} min`}
            durationCaption={translate('myTravels.duration')}
          />

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
            destination={{
              label: translate('myTravels.destination'),
              primaryText: detailsTrip.destination.name ?? '',
            }}
          />

          {detailsTrip.customer && (
            <PartnerCard
              label={translate('myTravels.passenger')}
              name={detailsTrip.customer.nickname ?? detailsTrip.customer.name ?? ''}
              photoUrl={customerPhotoUrl}
              rating={detailsTrip.customer.rating}
              tripsCount={detailsTrip.customer.quantityTrips}
              tripsCountLabel={translate('myTravels.trips_count')}
            />
          )}

          {canReportProblem && (
            <ReportProblemButtonWrapper>
              <ReportProblemButton
                label={translate('myTravels.report_problem')}
                onPress={() => setModalMessage(true)}
              />
            </ReportProblemButtonWrapper>
          )}

          {statusKey !== STATUS_CANCELED.toUpperCase() && (
            <EarningsCard
              title={translate('myTravels.earnings')}
              rows={earningsRows}
              totalLabel={translate('myTravels.net_value_received')}
              totalValueLabel={`${cityConfig?.typeMoney}${Helper.maskMoney(
                Number(detailsTrip?.financialBreakdown?.netValue ?? fareBreakdown.total),
              )}`}
              viewFullCalculationLabel={translate('myTravels.view_full_calculation')}
              onViewFullCalculation={() => {
                (navigation as any).navigate('TripCalculationDetails', {
                  tripReference,
                  trip,
                  detailsTrip,
                });
              }}
            />
          )}
        </Content>
      )}

      {showError && (
        <ErrorContainer>
          <Ionicons name="alert-circle-outline" size={RFValue(32)} color={theme.colors.primary} />
          <ErrorTitle>{translate('detailsTrip.error_loading_title')}</ErrorTitle>
          <ErrorSubtitle>{translate('detailsTrip.error_loading_subtitle')}</ErrorSubtitle>
          <RetryButton activeOpacity={0.7} onPress={() => getDetailsTrip(tripReference)}>
            <Ionicons name="reload" size={RFValue(14)} color={theme.colors.white} />
            <RetryButtonText>{translate('detailsTrip.retry')}</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      )}

      <HelpMethodModal tripReference={tripReference} visible={modalMessage} setVisible={setModalMessage} />
    </Container>
  );
};
