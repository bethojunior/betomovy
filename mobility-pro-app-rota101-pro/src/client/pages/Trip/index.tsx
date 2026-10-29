import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView from 'react-native-maps';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import { BackHandler } from 'react-native';
import { useTrip } from '../../contexts/Trip';
import { useLocal } from '../../contexts/local';
import LookUpAddressesModal from '../../components/LookUpAddressesModal';
import TravelOptions from '../../components/TravelOptions';

import {
  Container,
  ContainerAlertPanic,
  ContainerButtonFloat,
  ContainerDuration,
  ContainerPanic,
  ViewPanic,
} from './styles';
import { DestinationCard } from '../../components/DestinationCard';
import TripContent from '../../components/TripContent';
import Preload from '../../components/Preload';
import theme from '../../styles/theme';
import { If } from '../../components/If';
import { ModalDataDriver } from '../../components/ModalDataDriver';
import { TextEdit } from '../../components/TextEdit';
import { CardPanic } from '../../components/CardPanic';
import { usePanic } from '../../contexts/Panic';
import { translate } from '../../locales';
import { ModalWho } from '../../components/ModalWho';
import { useAuth } from '../../../context/auth';
import { usePaymentForm } from '../../contexts/paymentForms';
import {
  STATUS_BOARDING,
  STATUS_FINISHED,
  STATUS_IN_PROGRESS,
  STATUS_SCHEDULED,
  STATUS_SEARCHING,
  STATUS_ACCEPTED,
} from '../../constants/trip';
import Helper from '../../utils/Helper';
import { FloatButton } from '../../components/FloatButton';
import { ProgressBar } from '../../components/ProgressBar';
import { ModalOfferNewTripType } from '../../components/ModalOfferNewTripType';
import { DestinationFree } from './types';
import TripMap from '../../components/TripMap';
import TripRouteSemanticsView from '../../components/TripRouteSemanticsView';
import {
  formatDistanceForAccessibility,
  shouldRenderTripRouteSemantics,
} from '../../utils/trip-route-accessibility';
import { ModalAlert } from '../../../driver/src/components/ModalAlert';
import { Audio } from 'expo-av';
import { useAddressGeocoding } from '~/hooks/useAddressGeocoding';

const MAP_PITCH = 0;
const MAP_ZOOM = 20;
const MAP_ALTITUDE = 500; // iOS: altitude equivalente ao zoom 20 no Android

interface TypeProps {
  id: string;
  name: string;
  statusId: string;
}

export default function Trip({ route }) {
  const mapRef = useRef<MapView | null>(null);
  const timeoutsRef = useRef([]);
  const animationInterval = useRef(null);
  const {
    address: destinationFree,
    loading: loadingAddress,
    error: errorMapText,
    fetchAddress,
    cancelFetch,
    setAddress: setDestinationFree,
  } = useAddressGeocoding();
  const { position, setLastPlaceSelected } = useLocal();
  const { partner, generalSettings, user } = useAuth();
  const { getListProblems } = usePanic();
  const { getCurrentBalanceVoucher } = usePaymentForm();
  const [typesProblems, setTypesProblems] = useState<TypeProps[]>([]);
  const [modalDriverData, setModalDriverData] = useState(false);
  const [monitoringAnimation, setMonitoringAnimation] = useState(false);
  const [visibleProtect, setVisibleProtect] = useState(false);
  const [visibleAlertProtect, setVisibleAlertProtect] = useState(false);
  const [visibleWho, setVisibleWho] = useState(false);
  const [visibleArrow, setVisibleArrow] = useState(false);
  const [region] = useState(
    position
      ? {
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }
      : null,
  );
  const [destinationPerson, setDestinationPerson] = useState(false);
  const [visibleOptionTravel, setVisibleOptionTravel] = useState<boolean>(true);

  const [firstLoad, setFirstLoad] = useState(false);
  const [valueVoucher, setValueVoucher] = useState(0);
  const countClick = useRef(0);
  const [loading] = useState<boolean>(false);
  const [typeAddress, setTypeAddress] = useState<string>('');
  const [regionChangeMap, setRegionChangeMap] = useState({
    latitude: position?.latitude,
    longitude: position?.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isTripNoDestinationAnother, setIsTripNoDestinationAnother] = useState<
    boolean | null
  >(null);

  const {
    calculateAll,
    getTripPaymentMethods,
    clearTrip,
    stateTripCustomer,
    dispatchTripCustomer,
  } = useTrip();

  const {
    origin,
    destination,
    waypoints,
    polylineCoordinates,
    hideTravelOptions,
    visibleLookUpAddressesModal,
    trip,
    lastDestination,
    lastPolylineCoordinates,
    distance,
    lastOrigin,
    loadingTrip,
    offerOtherTypeTrip,
    showModalScheduled,
  } = stateTripCustomer;

  const navigation = useNavigation<any>();
  const isPixConfirmedReturn = useMemo(
    () => route?.params?.pixResult === 'confirmed',
    [route?.params?.pixResult],
  );

  const handleAddressesCapture = useCallback(
    async ({ origin, destination: destiny, waypoints }) => {
      if (isPixConfirmedReturn) return;

      calculateAll(origin, destiny, waypoints);
      getTripPaymentMethods();
      dispatchTripCustomer({
        type: 'update',
        field: 'lastDestination',
        arg: destiny,
      });
      setDestinationPerson(false);
      if (partner?.idPartner) {
        return setVisibleWho(true);
      }
      dispatchTripCustomer({
        type: 'update',
        field: 'visibleLookUpAddressesModal',
        arg: false,
      });
      dispatchTripCustomer({
        type: 'update',
        field: 'hideTravelOptions',
        arg: false,
      });
    },
    [
      calculateAll,
      getTripPaymentMethods,
      dispatchTripCustomer,
      partner,
      isPixConfirmedReturn,
    ],
  );

  const handleBack = useCallback((results) => {
    if (navigation.canGoBack()) navigation.goBack();
  }, []);

  const handleMyLocation = useCallback(() => {
    if (trip && Object.keys(trip).length > 0) {
      mapRef?.current?.fitToCoordinates(polylineCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
      return;
    }

    mapRef?.current?.animateCamera({
      center: {
        latitude: position.latitude,
        longitude: position.longitude,
      },
      zoom: MAP_ZOOM,
      altitude: MAP_ALTITUDE,
      heading: 0,
      pitch: MAP_PITCH,
    });
  }, [position, destination, trip, polylineCoordinates]);

  const clearAndReturn = async () => {
    await dispatchTripCustomer({ type: 'clearTrip' });
    await AsyncStorage.removeItem('trip');

    navigation.navigate('TripRoutes', {
      screen: 'Home',
      params: { noUnsubscribe: true, pixCacheAction: 'cancel' },
    });
  };

  const animateToOrigin = async () => {
    await mapRef.current?.animateCamera(
      {
        center: {
          latitude: lastOrigin.latitude || 0,
          longitude: lastOrigin.longitude || 0,
        },
        zoom: MAP_ZOOM,
        altitude: MAP_ALTITUDE,
        heading: 0,
        pitch: MAP_PITCH,
      },
      { duration: 500 },
    );
  };

  const animateToPolyline = async () => {
    if (lastPolylineCoordinates && lastPolylineCoordinates.length > 0) {
      await mapRef.current?.fitToCoordinates(lastPolylineCoordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const animateToDestination = async () => {
    await mapRef.current?.animateCamera(
      {
        center: {
          latitude: lastDestination.latitude || 0,
          longitude: lastDestination.longitude || 0,
        },
        zoom: MAP_ZOOM,
        altitude: MAP_ALTITUDE,
        heading: 0,
        pitch: MAP_PITCH,
      },
      { duration: 500 },
    );
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (animationInterval.current) clearInterval(animationInterval.current);
  };

  const animateSequence = async () => {
    await animateToOrigin();
    timeoutsRef.current.push(
      setTimeout(async () => {
        await animateToPolyline();
        timeoutsRef.current.push(
          setTimeout(async () => {
            await animateToDestination();
            timeoutsRef.current.push(
              setTimeout(async () => {
                await animateToPolyline();
                timeoutsRef.current.push(
                  setTimeout(() => {
                    setMonitoringAnimation(!monitoringAnimation);
                    if (trip?.status === STATUS_SEARCHING) {
                      // Se ainda estivermos no STATUS_SEARCHING, comece a sequência novamente.
                      animateSequence();
                    }
                  }, 1900),
                );
              }, 500),
            );
          }, 2500),
        );
      }, 3500),
    );
  };

  useEffect(() => {
    if (trip.status === STATUS_SEARCHING) {
      animateSequence();
    } else {
      animateToPolyline();
      clearAllTimeouts();
    }

    return () => clearAllTimeouts(); // limpar todos os timeouts quando o componente for desmontado
  }, [trip, monitoringAnimation]);

  useEffect(() => {
    if (polylineCoordinates && polylineCoordinates.length > 0) {
      if (![STATUS_FINISHED, STATUS_IN_PROGRESS, STATUS_ACCEPTED].includes(trip.status)) {
        mapRef?.current?.animateCamera({
          center: {
            latitude: Number(lastDestination?.latitude) || 0,
            longitude: Number(lastDestination?.longitude) || 0,
          },
          zoom: MAP_ZOOM,
          altitude: MAP_ALTITUDE,
          heading: 0,
          pitch: MAP_PITCH,
        });
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(polylineCoordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }, 1500);
      } else {
        mapRef.current?.fitToCoordinates(polylineCoordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
        clearAllTimeouts();
      }
    }
  }, [polylineCoordinates, trip]);

  useEffect(() => {
    dispatchTripCustomer({
      type: 'update',
      field: 'hideTravelOptions',
      arg: true,
    });

    if (trip && trip.status && trip?.status !== STATUS_SCHEDULED) {
      dispatchTripCustomer({
        type: 'update',
        field: 'visibleLookUpAddressesModal',
        arg: false,
      });
    } else {
      if (trip?.status === STATUS_SCHEDULED) {
        dispatchTripCustomer({ type: 'scheduledTrip' });
      }

      const isVisibleLookUpAddressesModal = isPixConfirmedReturn === false;
      dispatchTripCustomer({
        type: 'update',
        field: 'visibleLookUpAddressesModal',
        arg: isVisibleLookUpAddressesModal,
      });
    }

    async function getSelectedPaymentMethod() {
      const lastSelectedPaymentMethod = await AsyncStorage.getItem(
        'lastSelectedPaymentMethod',
      );

      if (lastSelectedPaymentMethod) {
        dispatchTripCustomer({
          type: 'update',
          field: 'selectedPaymentMethod',
          arg: JSON.parse(lastSelectedPaymentMethod || '{}'),
        });
      }
    }

    getSelectedPaymentMethod();
  }, [trip?.tripReference, trip?.status]);

  const handleSelectAddress = (datas: DestinationFree) => {
    if (!datas) return;
    if (typeAddress === 'origin') {
      dispatchTripCustomer({
        type: 'update',
        field: 'origin',
        arg: {
          address: datas.address,
          latitude: datas.latitude,
          longitude: datas.longitude,
          street: datas.street || null,
          type: datas.type,
        },
      });
      setTypeAddress('');
      return;
    }
    if (waypoints.length > 0) {
      const dataWaypoint = waypoints.find((item) => item?.id && item.address === '');
      if (!dataWaypoint) {
        dispatchTripCustomer({
          type: 'update',
          field: 'destination',
          arg: {
            address: datas.address,
            latitude: datas.latitude,
            longitude: datas.longitude,
            street: datas.street || null,
            type: datas.type,
          },
        });
        return;
      }
      dispatchTripCustomer({
        type: 'update',
        field: 'waypoints',
        arg: [
          ...waypoints.map((waypoint) => {
            if (waypoint.id === dataWaypoint.id)
              return {
                ...waypoint,
                address: datas.address,
                latitude: datas.latitude,
                longitude: datas.longitude,
                street: datas.street || null,
                type: datas.type,
              };

            return waypoint;
          }),
        ],
      });
    } else {
      dispatchTripCustomer({
        type: 'update',
        field: 'destination',
        arg: {
          address: datas.address,
          latitude: datas.latitude,
          longitude: datas.longitude,
          street: datas.street || null,
          type: datas.type,
        },
      });
    }
  };

  const loadingDestinationFree = (region) => {
    if (Object.keys(destination).length > 0) return;

    if (!destinationPerson) {
      setDestinationFree(origin);
      return;
    }

    fetchAddress(region);
  };

  const listProblems = async () => {
    const response = await getListProblems();
    if (!response.status) {
      return;
    }
    setTypesProblems(response.data);
  };

  const handleChangeRegionMap = (region) => {
    cancelFetch();
    setRegionChangeMap(region);
  };

  const isTripPartner = async () => {
    const tripPartner = JSON.parse(
      (await AsyncStorage.getItem('tripPartnerList')) || '{}',
    );

    return tripPartner?.find(({ tripReference }) => {
      if (tripReference === trip.tripReference) {
        return setVisibleArrow(true);
      }
      return setVisibleArrow(false);
    });
  };

  useEffect(() => {
    listProblems();
    isTripPartner();
  }, []);

  const getCurrentSaldVoucher = useCallback(async () => {
    try {
      const data: any = await getCurrentBalanceVoucher();
      if (data) {
        // Se houver saldo em carteira e/ou voucher, o saldo total disponível para pagamento é a soma
        const total = (Number(data.tripBalance) || 0) + (Number(data.balance) || 0);
        setValueVoucher(total > 0 ? total : (Number(data.tripBalance) || 0));
      }
    } catch (e) {
      // Ignora erro silencioso
    }
  }, [getCurrentBalanceVoucher]);

  useFocusEffect(
    useCallback(() => {
      getCurrentSaldVoucher();
    }, [getCurrentSaldVoucher])
  );

  useEffect(() => {
    getCurrentSaldVoucher();
  }, []);

  const clearAllState = useCallback(() => {
    setLastPlaceSelected({});
    setIsTripNoDestinationAnother(null);

    AsyncStorage.removeItem('@app:tripNoDestination');
    AsyncStorage.removeItem('@app:tripNoDestinationAnother');

    dispatchTripCustomer({ type: 'clearTrip' });
    dispatchTripCustomer({
      type: 'update',
      field: 'inputWho',
      arg: { name: '', phone: '' },
    });
  }, [setLastPlaceSelected, dispatchTripCustomer]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (Object.keys(trip).length === 0) {
        navigation.navigate('TripRoutes', { screen: 'Home' });
      }
      return true;
    });
    return () => subscription.remove();
  }, [trip]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      const state = navigation.getState();
      const nextRoute = state?.routes?.[state.index]?.name;
      if (nextRoute === 'TripPixPayment') return;

      if (Object.keys(trip).length === 0) {
        clearAllState();
      }
    });
    return unsubscribe;
  }, [navigation, trip, clearAllState]);

  useEffect(() => {
    if (destinationPerson) {
      mapRef?.current?.animateCamera({
        pitch: MAP_PITCH,
      });
    }
  }, [destinationPerson]);

  useEffect(() => {
    if (Object.keys(origin).length > 0) {
      dispatchTripCustomer({
        type: 'update',
        field: 'lastOrigin',
        arg: origin,
      });
    }
  }, [origin]);

  const switchsTrue = (param: string) => {
    return Object.keys(origin).length > 0
      ? Number(origin[param])
      : Number(lastOrigin[param])
        ? Number(lastOrigin[param])
        : position[param];
  };

  const handleBackButtonOnAddress = (type: string) => {
    setDestinationPerson(true);
    setTypeAddress(type);
    return type;
  };

  const handleCloseModalScheduled = () => {
    dispatchTripCustomer({
      type: 'update',
      field: 'showModalScheduled',
      arg: false,
    });
  };

  const mountSong = async () => {
    const { sound } = await Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../assets/songs/scheduledTrip.mp3'),
    );
    return sound;
  };

  useEffect(() => {
    if (!showModalScheduled) return;

    let soundRef: Audio.Sound | null = null;

    mountSong().then(async (sound) => {
      soundRef = sound;
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      await sound?.playAsync();
    });

    return () => {
      soundRef?.unloadAsync();
    };
  }, [showModalScheduled]);

  return (
    <>
      <Container>
        <Preload visible={loading} />
        <If condition={visibleLookUpAddressesModal && !isPixConfirmedReturn}>
          <LookUpAddressesModal
            onBack={handleBack}
            onComplete={handleAddressesCapture}
            visible={visibleLookUpAddressesModal}
            destinationPerson={destinationPerson}
            handleBackButtonOnAddress={handleBackButtonOnAddress}
            voice={route?.params?.voice}
            typeAddress={typeAddress}
            isTripNoDestinationAnother={isTripNoDestinationAnother}
            setIsTripNoDestinationAnother={setIsTripNoDestinationAnother}
          />
        </If>

        <ModalAlert
          icon="info"
          title={`${translate('service.title_schedule_compliments')} ${
            user?.nameUser?.split(' ')[0]
          }. ${translate('service.title_schedule_modal')}`}
          body={translate('service.text_schedule_client_modal')}
          visibleModal={showModalScheduled}
          handleSubmissModal={handleCloseModalScheduled}
        />

        {position && (
          <>
            <TripMap
              mapRef={mapRef}
              firstLoad={firstLoad}
              position={position}
              setFirstLoad={setFirstLoad}
              polylineCoordinates={polylineCoordinates}
              setVisibleProtect={setVisibleProtect}
              region={region}
              handleChangeRegionMap={handleChangeRegionMap}
              loadingDestinationFree={loadingDestinationFree}
              trip={trip}
              switchsTrue={switchsTrue}
              regionChangeMap={regionChangeMap}
              hideTravelOptions={hideTravelOptions}
              destinationPerson={destinationPerson}
              waypoints={waypoints}
              pitch={MAP_PITCH}
              zoom={MAP_ZOOM}
              altitude={MAP_ALTITUDE}
            />
            {shouldRenderTripRouteSemantics(origin?.address, destination?.address) && (
              <TripRouteSemanticsView
                originAddress={origin?.address ?? ''}
                destinationAddress={destination?.address ?? ''}
                distanceLabel={formatDistanceForAccessibility(distance, generalSettings)}
              />
            )}
            <ProgressBar visible={trip?.status == STATUS_BOARDING} />
            <If condition={regionChangeMap?.latitude !== undefined && hideTravelOptions}>
              <DestinationCard
                destinationPerson={destinationPerson}
                loadingTrip={loadingTrip}
                loadingAddress={loadingAddress}
                errorMessage={errorMapText}
                address={destinationFree?.address}
                onConfirmAddress={() => handleSelectAddress(destinationFree)}
                onRetry={() => loadingDestinationFree(regionChangeMap)}
                onSetLocationOnMap={() => setDestinationPerson(true)}
              />
            </If>

            <If condition={distance && trip && !trip.driver}>
              <ContainerDuration>
                <TextEdit color={theme.colors.primaryText}>
                  {`${Helper.kmToMiles(
                    Number(distance || 0).toFixed(1),
                    Helper.generalSettingsActive(
                      generalSettings,
                      'enable_transform_km_for_mi',
                    ),
                  )}`}
                </TextEdit>
              </ContainerDuration>
            </If>

            <If condition={polylineCoordinates && !visibleLookUpAddressesModal}>
              <ContainerButtonFloat>
                <If condition={visibleArrow}>
                  <FloatButton
                    icon={
                      <MaterialIcons
                        name="arrow-back"
                        size={24}
                        color={theme.colors.primaryText}
                      />
                    }
                    onPress={clearAndReturn}
                  />
                </If>
                <FloatButton
                  icon={
                    <MaterialIcons
                      name="my-location"
                      size={24}
                      color={theme.colors.primaryText}
                    />
                  }
                  onPress={handleMyLocation}
                />
                <If
                  condition={
                    generalSettings.find(
                      (item) => item?.key === 'enable_security_button_options',
                    )?.value === '1' &&
                    hideTravelOptions &&
                    !visibleLookUpAddressesModal &&
                    !visibleProtect &&
                    trip.driver
                  }
                >
                  <ContainerPanic>
                    <FloatButton
                      icon={
                        <FontAwesome
                          name="shield"
                          size={24}
                          style={{
                            color: theme.colors.primaryText,
                          }}
                        />
                      }
                      onPress={() => {
                        countClick.current++;

                        if (countClick.current === 2) {
                          setVisibleProtect(true);
                          setVisibleAlertProtect(false);
                          countClick.current = 0;
                        }
                        setVisibleAlertProtect(true);
                        setTimeout(() => {
                          countClick.current = 0;
                          setVisibleAlertProtect(false);
                        }, 1000);
                      }}
                    />
                    <If condition={visibleAlertProtect}>
                      <ContainerAlertPanic
                        from={{
                          opacity: 0,
                          transform: [{ translateY: -20 }],
                        }}
                        animate={{
                          opacity: 1,
                          transform: [{ translateY: 0 }],
                        }}
                        exit={{
                          opacity: 0,
                          transform: [{ translateY: -20 }],
                        }}
                      >
                        <TextEdit size="small">
                          {translate('panic.text_two_taps_activate_security_alert')}
                        </TextEdit>
                      </ContainerAlertPanic>
                    </If>
                  </ContainerPanic>
                </If>
              </ContainerButtonFloat>
            </If>
          </>
        )}
        <ModalOfferNewTripType setVisibleTravelOption={setVisibleOptionTravel} />
        <TravelOptions
          hide={hideTravelOptions}
          setVisibleOptionTravel={setVisibleOptionTravel}
          visibleOptionTravel={visibleOptionTravel}
          valueVoucher={valueVoucher}
          setIsTripNoDestinationAnother={setIsTripNoDestinationAnother}
        />
        <If
          condition={
            hideTravelOptions && !visibleLookUpAddressesModal && !offerOtherTypeTrip
          }
        >
          <TripContent setModalDriverData={setModalDriverData} />
        </If>
        <ModalDataDriver visible={modalDriverData} setVisible={setModalDriverData} />
        <If condition={visibleProtect}>
          <ViewPanic>
            <CardPanic data={typesProblems} setVisible={setVisibleProtect} />
          </ViewPanic>
        </If>

        <ModalWho
          visible={visibleWho}
          setVisible={setVisibleWho}
          setIsTripNoDestinationAnother={setIsTripNoDestinationAnother}
        />
      </Container>
    </>
  );
}
