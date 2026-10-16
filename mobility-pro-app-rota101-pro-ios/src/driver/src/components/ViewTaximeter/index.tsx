import { useCallback, useEffect, useRef, useState } from 'react';
import { translate } from '~/client/locales';
import { TripTypeUnic } from './types';
import { useTaximeter } from '../../context/Taximeter';
import { useTripProvider } from '../../context/Trip';
import { useTripStatusProvider } from '../../context/TripStatus';
import { useLocal } from '../../hooks/location';
import ViewTaximeterComponent from '../ViewTaximeterComponent';
import { useNetwork } from '../../../../context/ConfigGlobal';
import { Fare } from '~/interfaces/trip';
import { customToast } from '~/utils/FlashMessage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { offlineTripQueue } from '~/hooks/useOfflineTripActions';

interface Props {
  onClose?: () => void;
  selectedTripTaximeter?: TripTypeUnic;
  setContainerTaximeter?: (value: boolean) => void;
  setSelectedTripTaximeter?: (value: TripTypeUnic) => void;
  setIniTripModal?: (value: boolean) => void;
}

export const ViewTaximeter = ({
  onClose,
  selectedTripTaximeter,
  setSelectedTripTaximeter,
  setContainerTaximeter,
  setIniTripModal,
}: Props) => {
  const {
    trip,
    isPaused,
    updatePrice,
    clearTrip,
    start,
    stop,
    updateMetrics,
    updateRouteDistance,
    getPrices,
    resume,
    pause,
  } = useTaximeter();

  const { clearDataTrip, dispatchTrip, stateTrip } = useTripProvider((ctx) => ctx);

  const {
    checkStatusTrip,
    clearDataTrip: clearTripStatus,
    confirmFinishTrip,
  } = useTripStatusProvider((ctx) => ctx);

  const tripAccepted = stateTrip.tripAccepted;

  const { location } = useLocal();
  const { navigate } = useNavigation<NavigationProp<any>>();

  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [fare, setFare] = useState<Fare>(null);

  const price: number = Number(trip?.price) || 0;
  const distance: number = Number(trip?.distance) || 0;
  const estimatedTripTime: number = Number(trip?.estimatedTripTime) || 0;

  const { itsNetwork } = useNetwork();

  const lastKmRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const loadPrices = async () => {
    if (trip?.fare != null) {
      setFare(trip.fare);
      setLoading(false);
      return;
    }

    if (!selectedTripTaximeter?.tripTypeId || !location) {
      setLoading(false);
      return;
    }

    try {
      const response = await getPrices(selectedTripTaximeter?.tripTypeId, location);

      setFare(response);
    } catch (error) {
      console.error('Erro ao obter os preços: ' + error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async () => {
    if (loading) return;

    if (isPaused) {
      return resume();
    }

    if (!fare) {
      customToast(translate('taximeter.text_no_fare_found'), 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await start(
        selectedTripTaximeter?.tripTypeId,
        fare?.id,
        fare?.multiplierValue || '',
        location,
      );

      await calculateNewPrice(
        response?.tripDiscountCoupon || 0,
        response?.multiplierDynamic || 0,
        response?.tripWayPoints || [],
        response?.fare,
        distance,
        estimatedTripTime,
      );

      AsyncStorage.setItem('tripDriver', JSON.stringify(response));

      dispatchTrip({ type: 'update', field: 'tripAccepted', arg: response });
    } catch (error) {
      console.error('Erro ao iniciar a corrida: ' + error?.message);
    } finally {
      setLoading(false);
    }
  };

  function checkAdditionalValueKM(
    km,
    km_to_additional_value,
    additional_value_after_km,
    type_additional_value_after_km,
  ) {
    if (parseFloat(km_to_additional_value) > 0)
      if (km >= parseFloat(km_to_additional_value)) {
        switch (type_additional_value_after_km) {
          case 'km':
            return (
              (km - parseFloat(km_to_additional_value)) *
              parseFloat(additional_value_after_km)
            );
          case '$':
            return parseFloat(additional_value_after_km);
          default:
            return 0;
        }
      }

    return 0;
  }

  function checkMultiplierDynamic(value, multiplierDynamic) {
    if (multiplierDynamic == null) return value;

    if (parseFloat(multiplierDynamic) === 0) return value;

    return value * parseFloat(multiplierDynamic);
  }

  function checkTripDiscountCoupon(value, tripDiscountCoupon) {
    if (tripDiscountCoupon != null) {
      switch (tripDiscountCoupon.valueType) {
        case '%':
          return value - (value * parseFloat(tripDiscountCoupon.value)) / 100;
        case '$':
          return value - parseFloat(tripDiscountCoupon.value);
        default:
          return value;
      }
    }
    return value;
  }

  const syncTaximeterProgress = useCallback(() => {
    if (loading) return;

    const hasChanged =
      distance !== lastKmRef.current || estimatedTripTime !== lastTimeRef.current;

    if (!hasChanged) return;

    lastKmRef.current = distance;
    lastTimeRef.current = estimatedTripTime;

    updateMetrics(distance, estimatedTripTime, price);
  }, [distance, estimatedTripTime, price, loading]);

  async function calculateNewPrice(
    tripDiscountCoupon = 0,
    multiplierDynamic,
    tripWayPoints = [],
    fare,
    km,
    minute,
  ) {
    const value =
      parseFloat(fare?.km_price || 0) * km +
      parseFloat(fare.minute_price) * parseInt(minute, 10) +
      parseFloat(fare.base_price) +
      parseFloat(fare.another_fee) +
      parseFloat(fare.tax_price) +
      parseFloat(fare.waypoint_price) * tripWayPoints.length +
      checkAdditionalValueKM(
        km,
        fare.km_to_additional_value,
        fare.additional_value_after_km,
        fare.type_additional_value_after_km,
      );

    const newPrice = checkTripDiscountCoupon(
      checkMultiplierDynamic(value, multiplierDynamic),
      tripDiscountCoupon,
    );

    const minPrice = checkTripDiscountCoupon(
      checkMultiplierDynamic(fare.min_price, multiplierDynamic),
      tripDiscountCoupon,
    );

    if (newPrice < parseFloat(minPrice)) {
      updatePrice(minPrice);
      return;
    }

    updatePrice(newPrice);
  }

  function stopTaximentWithoutNetwork(distance: number, price: number) {
    offlineTripQueue.addFinishTaximeter({
      tripReference: trip.tripReference,
      estimatedTripTime: Number(trip.estimatedTripTime || 0),
      km: distance,
      price,
    });
  };

  const handleStop = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (itsNetwork) {
        await stop(distance, price);
      } else {
        stopTaximentWithoutNetwork(distance, price);
      }

      const result = await checkStatusTrip();
      if (!!result?.callback) {
        await confirmFinishTrip();

        clearTripStatus();
        clearDataTrip();
        resetTaximeterState();

        navigate('FinishTripResume', { tripAccepted: trip });
      } else {
        customToast(translate('taximeter.text_stop_trip_failed'), 'error');
      }
    } catch (error) {
      console.log('Erro ao parar a corrida: ' + error?.message);
    } finally {
      setLoading(false);
    }
  };

  const resetTaximeterState = () => {
    setSelectedTripTaximeter({} as TripTypeUnic);
    setContainerTaximeter(false);
    setIniTripModal(false);

    lastKmRef.current = null;
    lastTimeRef.current = null;

    resume();
    clearTrip();
  };

  const updateLocation = async (latitude: number, longitude: number) => {
    if (isPaused) return;

    if (!!trip?.price) {
      const km = updateRouteDistance(latitude, longitude);

      await calculateNewPrice(
        trip?.tripDiscountCoupon || 0,
        trip?.multiplierDynamic || 0,
        trip?.tripWayPoints || [],
        fare,
        km,
        estimatedTripTime,
      );
    }
  };

  const toggleContent = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    loadPrices();

    const time = setTimeout(() => {
      setIsExpanded(true);
    }, 200);

    return () => clearTimeout(time);
  }, []);

  useEffect(() => {
    if (tripAccepted?.cancelledBy === 'customer') {
      resetTaximeterState();
    }
  }, [tripAccepted?.cancelledBy]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      syncTaximeterProgress();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, syncTaximeterProgress]);

  useEffect(() => {
    if (location?.coords?.latitude && !loading) {
      updateLocation(location?.coords?.latitude, location?.coords?.longitude);
    }
  }, [location, loading, estimatedTripTime]);

  return (
    <ViewTaximeterComponent
      expanded={isExpanded}
      priceTaximeter={price}
      handleOnLayout={toggleContent}
      onClose={onClose}
      km={distance}
      countMinute={estimatedTripTime}
      loading={loading}
      isPause={isPaused}
      handlePlay={handlePlay}
      handlePause={pause}
      handleStop={handleStop}
      dataPrices={fare}
    />
  );
};
