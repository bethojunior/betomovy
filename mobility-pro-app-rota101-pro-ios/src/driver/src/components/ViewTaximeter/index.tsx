import {Toast} from 'toastify-react-native';
import {useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TripTypeUnic} from './types';
import {useTaximeter} from '../../context/Taximeter';
import {DataTripTypePrice} from '../../context/Taximeter/types';
import {useTripProvider} from '../../context/Trip';
import {TripInfo} from '../../context/Trip/types';
import {useTripStatusProvider} from '../../context/TripStatus';
import {translate} from '../../../../client/locales';
import {useLocal} from '../../hooks/location';
import {calculateDistanceFromLatLonInMeters} from '../../../../client/utils/position';
import ViewTaximeterComponent from '../ViewTaximeterComponent';
import MapService from '../../../../client/services/mapService';
import {diffMinutes, getDiffDatesInSeconds} from '../../utils/FormatDate';
import {AppState} from 'react-native';
import {SwalAlert} from '../../../../client/components/SwalAlert';

interface Props {
  onClose?: () => void;
  selectedTripTaximeter?: TripTypeUnic;
  setModalTaximeter?: (value: boolean) => void;
  setContainerTaximeter?: (value: boolean) => void;
  setSelectedTripTaximeter?: (value: TripTypeUnic) => void;
  setIniTripModal?: (value: boolean) => void;
}
export const ViewTaximeter = ({
  onClose,
  selectedTripTaximeter,
  setSelectedTripTaximeter,
  setModalTaximeter,
  setContainerTaximeter,
  setIniTripModal,
}: Props) => {
  const {
    getPricesByTripType,
    startTripTaximeter,
    stopTripTaximeter,
    setTripTaximeter,
    tripTaximeter,
  } = useTaximeter();
  const {
    dispatchTrip,
    clearDataTrip,
    stateTrip: {tripAccepted},
  } = useTripProvider();
  const {checkStatusTrip, clearDataTrip: clearTripStatus} =
    useTripStatusProvider();
  const {location} = useLocal();
  const locationRef = useRef<{latitude: number; longitude: number}>(
    {} as {latitude: number; longitude: number},
  );

  locationRef.current = {
    latitude: location?.coords?.latitude,
    longitude: location?.coords?.longitude,
  };

  const countMinute = useRef(0);

  const [dataPrices, setDataPrices] = useState<DataTripTypePrice>(
    tripTaximeter?.fare,
  );
  const [loading, setLoading] = useState(false);
  const [priceTaximeter, setPriceTaximeter] = useState(0);
  const [heightContainer, setHeightContainer] = useState(false);
  const [time, setTime] = useState(null);
  const [isPause, setIsPause] = useState(false);
  const [lastKm, setLastKm] = useState(0);
  const [visible, setVisible] = useState(false);
  const kmRef = useRef(0);

  useEffect(() => {
    setTimeout(() => {
      setHeightContainer(true);
    }, 500);

    findPriceByTripType().then(async () => {
      if (tripTaximeter && Object.keys(tripTaximeter).length > 0 && !isPause) {
        if (time) {
          clearInterval(time);
        }
        const intervalTime = setInterval(() => {
          showDataTaximeter();
        }, 60000);
        setTime(intervalTime);
      }
    });
    return () => {
      if (time) {
        clearInterval(time);
      }
    };
  }, []);

  const foreGroundTask = async () => {
    const timeOut = await AsyncStorage.getItem('TX-timeBg');
    const paused = await AsyncStorage.getItem('taximeterIsPause');
    if ((!paused && timeOut) || (paused == 'false' && timeOut)) {
      const timeDiff = diffMinutes(timeOut);
      countMinute.current = countMinute.current + timeDiff;

      AsyncStorage.removeItem('TX-timeBg');
    }
  };

  useEffect(() => {
    const emmiterBackground = AppState.addEventListener(
      'change',
      async state => {
        if (state === 'active') {
          foreGroundTask();
        }
      },
    );

    return () => {
      if (emmiterBackground) {
        emmiterBackground?.remove();
      }
    };
  }, []);
  useEffect(() => {
    if (tripAccepted?.cancelledBy === 'customer') {
      resetTaximeterState();
    }
  }, [tripAccepted]);

  const getKmRouteTraveled = async () => {
    let meters = 0;

    const routeTraveled = MapService.decodePolyline(
      await AsyncStorage.getItem('routeTraveledTaximeter'),
    );

    if (routeTraveled === null) {
      kmRef.current = 0;
      return 0;
    }

    const routeLength = routeTraveled.length;
    for (let index = 1; index < routeLength; index++) {
      const lastPosition = routeTraveled[index - 1];
      const currentPosition = routeTraveled[index];

      if (lastPosition && currentPosition) {
        meters += calculateDistanceFromLatLonInMeters(
          lastPosition,
          currentPosition,
        );
      }
    }

    kmRef.current = meters / 1000;
    return meters / 1000;
  };

  const setRouteTraveled = async () => {
    const routeTraveled = await AsyncStorage.getItem('routeTraveledTaximeter');

    if (routeTraveled === null) {
      const initialRoute = [
        {
          latitude: locationRef?.current?.latitude,
          longitude: locationRef?.current?.longitude,
        },
      ];

      await AsyncStorage.setItem(
        'routeTraveledTaximeter',
        String(MapService.encondePolyline(initialRoute)),
      );

      kmRef.current = 0;
    } else {
      const routeDecoded = MapService.decodePolyline(routeTraveled);

      (routeDecoded as {}[]).push({
        latitude: locationRef?.current?.latitude,
        longitude: locationRef?.current?.longitude,
      });

      await AsyncStorage.setItem(
        'routeTraveledTaximeter',
        String(MapService.encondePolyline(routeDecoded)),
      );
      await getKmRouteTraveled();
    }

    return '';
  };

  const findPriceByTripType = async () => {
    setLoading(true);
    const price = await AsyncStorage.getItem('priceTaximeter');
    const itsPause = await AsyncStorage.getItem('taximeterIsPause');
    const time = await AsyncStorage.getItem('currentTimeTaximeter');
    const getFare = await AsyncStorage.getItem('fare');
    const lastKm = Number(await AsyncStorage.getItem('lastKmTaximeter'));

    setLastKm(lastKm || 0);
    if (tripTaximeter && Object.keys(tripTaximeter).length > 0 && price) {
      setPriceTaximeter(Number(price));
      itsPause && setIsPause(true);
      if (time) {
        countMinute.current = Number(time);
      }
      getKmRouteTraveled();
      setDataPrices(JSON.parse(getFare));
      setLoading(false);
      return;
    }
    const response = await getPricesByTripType(
      selectedTripTaximeter?.tripTypeId,
      location,
    );
    if (!response) {
      onClose();
      Toast.error('Erro ao buscar tarifas, busque novamente');
      setModalTaximeter(true);
      return;
    }
    await AsyncStorage.setItem('fare', JSON.stringify(response));
    setDataPrices(response);
    setLoading(false);
  };

  const handlePlay = async () => {
    try {
      setLoading(true);
      const itsPause = await AsyncStorage.getItem('taximeterIsPause');

      if (isPause || itsPause === 'true') {
        await AsyncStorage.removeItem('taximeterIsPause');
        setIsPause(false);
      } else {
        const fare = await AsyncStorage.getItem('fare');
        const response = await startTripTaximeter(
          selectedTripTaximeter?.tripTypeId,
          setTripTaximeter,
          dataPrices?.id,
          JSON.parse(fare)?.multiplierValue || '',
          location,
        );
        await AsyncStorage.setItem(
          'startTaximetro',
          JSON.stringify(new Date()),
        );
        await AsyncStorage.setItem('tripDriver', JSON.stringify(response));

        await calculateNewPrice(
          response?.tripDiscountCoupon || 0,
          response?.multiplierDynamic || 0,
          response?.tripWayPoints || [],
          dataPrices,
          // eslint-disable-next-line no-unsafe-optional-chaining
          kmRef?.current + lastKm,
          countMinute?.current,
        );
        dispatchTrip({type: 'update', field: 'tripAccepted', arg: response});
      }

      if (time) {
        clearInterval(time);
      }

      const intervalTime = setInterval(() => {
        showDataTaximeter();
      }, 60000);

      setTime(intervalTime);
    } catch (error) {
      // Trate o erro aqui
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

  useEffect(() => {
    (async () => {
      if (countMinute.current > 0) {
        await AsyncStorage.setItem(
          'currentTimeTaximeter',
          String(countMinute.current),
        );
      }
    })();
  }, [countMinute.current]);

  useEffect(() => {
    (async () => {
      if (priceTaximeter) {
        await AsyncStorage.setItem('priceTaximeter', String(priceTaximeter));
      }
    })();
  }, [priceTaximeter]);

  async function calculateNewPrice(
    tripDiscountCoupon = 0,
    multiplierDynamic,
    tripWayPoints = [],
    fare,
    km,
    minute,
    isTaximeter = false,
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
      await AsyncStorage.setItem('priceTaximeter', JSON.stringify(minPrice));
      return setPriceTaximeter(minPrice);
    }
    setPriceTaximeter(newPrice);
    await AsyncStorage.setItem('priceTaximeter', JSON.stringify(newPrice));
    return newPrice;
  }

  const showDataTaximeter = async (continuee = null) => {
    const dateStartTrip = await AsyncStorage.getItem('startTaximetro');
    if (!dateStartTrip) {
      return;
    }
    const dateStartTripParse = new Date(JSON.parse(dateStartTrip));
    const dateNow = new Date();
    clearInterval(time);

    const diff = (dateNow.getTime() - dateStartTripParse.getTime()) / 1000;
    const minutes = Math.floor(diff / 60);

    const minute = Number(countMinute.current) + 1;
    countMinute.current = Number(minute);
  };

  const saveDetails = () => {
    const details = {
      minutes: countMinute.current,
      km: kmRef.current + lastKm,
      tripReference: tripTaximeter.tripReference,
    };
    return AsyncStorage.setItem('taximetersDetails', JSON.stringify(details));
  };

  const handleStop = async () => {
    try {
      setLoading(true);
      tripTaximeter.estimatedTripTime = countMinute.current;

      await saveDetails();

      await stopTripTaximeter(
        Number((kmRef.current + lastKm).toFixed(2)) || 0,
        Number(priceTaximeter),
        tripTaximeter,
      );
      await checkStatusTrip();
      clearTripStatus();
      clearDataTrip();

      clearStorage();

      resetTaximeterState();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = () => {
    AsyncStorage.multiRemove([
      'startTaximetro',
      'currentTimeTaximeter',
      'priceTaximeter',
      'taximeterIsPause',
      'fare',
      'routeTraveledTaximeter',
      'lastKmTaximeter',
      'TX-timeBg',
    ]);
  };

  const resetTaximeterState = () => {
    setTripTaximeter({} as TripInfo);
    setSelectedTripTaximeter({} as TripTypeUnic);
    kmRef.current = 0;
    setContainerTaximeter(false);
    setPriceTaximeter(0);
    setIsPause(false);
    setIniTripModal(false);
    clearStorage();
  };

  const handlePause = async () => {
    clearTimeout(time);
    AsyncStorage.setItem('taximeterIsPause', 'true');
    setIsPause(true);
    const calc = lastKm + kmRef.current;
    setLastKm(calc);
    kmRef.current = 0;
    await AsyncStorage.setItem('lastKmTaximeter', String(calc));
    return AsyncStorage.removeItem('routeTraveledTaximeter');
  };

  // eslint-disable-next-line consistent-return
  const updateLocation = async () => {
    const itsPause = await AsyncStorage.getItem('taximeterIsPause');
    if (isPause || itsPause === 'true') {
      setIsPause(true);
      return '';
    }

    const price = await AsyncStorage.getItem('priceTaximeter');
    if (
      tripTaximeter &&
      Object.keys(tripTaximeter).length > 0 &&
      price !== null
    ) {
      await setRouteTraveled();
      await calculateNewPrice(
        tripTaximeter?.tripDiscountCoupon || 0,
        tripTaximeter?.multiplierDynamic || 0,
        tripTaximeter?.tripWayPoints || [],
        dataPrices,
        // eslint-disable-next-line no-unsafe-optional-chaining
        kmRef?.current + lastKm,
        countMinute?.current,
      );
    }
  };

  useEffect(() => {
    if (location?.coords?.latitude) {
      updateLocation();
    }
  }, [location]);

  const handleOnLayout = () => {
    setHeightContainer(!heightContainer);
  };

  return (
    <>
      <SwalAlert
        setVisible={setVisible}
        visible={visible}
        title={translate('taximeter.title_swal')}
        description={translate('taximeter.description_swal')}
      />
      <ViewTaximeterComponent
        heightContainer={heightContainer}
        priceTaximeter={priceTaximeter}
        handleOnLayout={handleOnLayout}
        tripTaximeter={tripTaximeter}
        onClose={onClose}
        kmRef={kmRef}
        countMinute={countMinute}
        loading={loading}
        isPause={isPause}
        handlePlay={handlePlay}
        handlePause={handlePause}
        handleStop={handleStop}
        dataPrices={dataPrices}
        lastKm={lastKm}
        setVisible={setVisible}
      />
    </>
  );
};
