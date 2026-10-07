import {useCallback, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';

import {Button} from 'react-native-paper';
import {BackHandler} from 'react-native';
import {debounce} from 'lodash';
import {useTrip} from '../../contexts/Trip';
import {useLocal} from '../../contexts/local';
import LookUpAddressesModal from '../../components/LookUpAddressesModal';
import TravelOptions from '../../components/TravelOptions';

import mapStyle from '../../styles/map.json';
import {
  CardContainer,
  Container,
  ContainerAlertPanic,
  ContainerButtonFloat,
  ContainerDuration,
  ContainerPanic,
  ViewPanic,
} from './styles';
import TripContent from '../../components/TripContent';
import Preload from '../../components/Preload';
import theme from '../../styles/theme';
import {If} from '../../components/If';
import {ModalDataDriver} from '../../components/ModalDataDriver';
import {TextEdit} from '../../components/TextEdit';
import apiMain from '../../api/apiMain';
import {CardPanic} from '../../components/CardPanic';
import {usePanic} from '../../contexts/Panic';
import {translate} from '../../locales';
import {ModalWho} from '../../components/ModalWho';
import {useAuth} from '../../../context/auth';
import {usePaymentForm} from '../../contexts/paymentForms';
import {
  STATUS_BOARDING,
  STATUS_FINISHED,
  STATUS_IN_PROGRESS,
  STATUS_SCHEDULED,
  STATUS_SEARCHING,
  STATUS_ACCEPTED,
} from '../../constants/trip';
import Helper from '../../utils/Helper';
import {FloatButton} from '../../components/FloatButton';
import {ProgressBar} from '../../components/ProgressBar';
import {ModalOfferNewTripType} from '../../components/ModalOfferNewTripType';
import {DestinationFree} from './types';
import TripMap from '../../components/TripMap';
import {CardNoCity} from '../../components/CardNoCity';

interface TypeProps {
  id: string;
  name: string;
  statusId: string;
}

export default function Trip({route}) {
  const mapRef = useRef<MapView | null>(null);
  const timeoutsRef = useRef([]);
  const animationInterval = useRef(null);
  const {position} = useLocal();
  const {partner, generalSettings} = useAuth();
  const {getListProblems} = usePanic();
  const {getCurrentBalanceVoucher} = usePaymentForm();
  const [typesProblems, setTypesProblems] = useState<TypeProps[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [modalDriverData, setModalDriverData] = useState(false);
  const [monitoringAnimation, setMonitoringAnimation] = useState(false);
  const [visibleProtect, setVisibleProtect] = useState(false);
  const [visibleAlertProtect, setVisibleAlertProtect] = useState(false);
  const [visibleWho, setVisibleWho] = useState(false);
  const [visibleArrow, setVisibleArrow] = useState(false);
  const [region, setRegion] = useState(
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
  const [destinationFree, setDestinationFree] = useState<DestinationFree>();
  const [valueVoucher, setValueVoucher] = useState(0);
  const countClick = useRef(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [typeAddress, setTypeAddress] = useState<string>('');
  const [regionChangeMap, setRegionChangeMap] = useState({
    latitude: position?.latitude,
    longitude: position?.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const {
    calculateAll,
    getTripPaymentMethods,
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
    isLoading,
    trip,
    lastDestination,
    lastPolylineCoordinates,
    distance,
    lastOrigin,
    loadingTrip,
    offerOtherTypeTrip,
    tripPartnerList,
  } = stateTripCustomer;

  const navigation = useNavigation();
  const lastTripPartner = tripPartnerList[tripPartnerList?.length - 1];

  const handleAddressesCapture = useCallback(
    async ({origin, destination: destiny, waypoints}) => {
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
    [],
  );

  const handleBack = useCallback(results => {
    if (navigation.canGoBack()) navigation.goBack();
  }, []);

  const handleMyLocation = useCallback(() => {
    if (trip && Object.keys(trip).length > 0) {
      mapRef?.current?.fitToCoordinates(polylineCoordinates, {
        animated: true,
      });
      return;
    }

    mapRef?.current?.animateCamera({
      center: {
        latitude: position.latitude,
        longitude: position.longitude,
      },
      zoom: 19,
      heading: 0,
      pitch: 90,
    });
  }, [position, destination, trip, polylineCoordinates]);

  const clearAndReturn = async () => {
    await dispatchTripCustomer({type: 'clearTrip'});
    await AsyncStorage.removeItem('trip');
    navigation.navigate('TripRoutes', {screen: 'Home'});
  };

  const animateToOrigin = async () => {
    await mapRef.current?.animateCamera(
      {
        center: {
          latitude: lastOrigin.latitude || 0,
          longitude: lastOrigin.longitude || 0,
        },
        zoom: 20,
        heading: 0,
        pitch: 90,
      },
      {duration: 500},
    );
  };

  const animateToPolyline = async () => {
    await mapRef.current?.fitToCoordinates(lastPolylineCoordinates, {
      animated: true,
    });
  };

  const animateToDestination = async () => {
    await mapRef.current?.animateCamera(
      {
        center: {
          latitude: lastDestination.latitude || 0,
          longitude: lastDestination.longitude || 0,
        },
        zoom: 20,
        heading: 0,
        pitch: 90,
      },
      {duration: 500},
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
    if (polylineCoordinates) {
      if (
        ![STATUS_FINISHED, STATUS_IN_PROGRESS, STATUS_ACCEPTED].includes(
          trip.status,
        )
      ) {
        mapRef?.current?.animateCamera({
          center: {
            latitude: Number(lastDestination?.latitude) || 0,
            longitude: Number(lastDestination?.longitude) || 0,
          },
          zoom: 19,
          heading: 0,
          pitch: 90,
        });
        setTimeout(() => {
          mapRef.current?.fitToCoordinates(polylineCoordinates, {
            animated: true,
          });
        }, 1500);
      } else {
        animateToPolyline();
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
        dispatchTripCustomer({type: 'scheduledTrip'});
      }
      dispatchTripCustomer({
        type: 'update',
        field: 'visibleLookUpAddressesModal',
        arg: true,
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
          arg: JSON.parse(lastSelectedPaymentMethod),
        });
      }
    }

    getSelectedPaymentMethod();
  }, [trip]);

  const handleDestinationPerson = useCallback(async (position, setLoading) => {
    const {
      data: {data},
    } = await apiMain.get(
      `geocoding/search?latlng=${position.latitude},${position.longitude}`,
    );
    setDestinationFree(data);
    setLoadingAddress(false);
    return data;
  }, []);

  const handleSelectAddress = (datas: DestinationFree) => {
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
      const dataWaypoint = waypoints.find(
        item => item?.id && item.address === '',
      );
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
          ...waypoints.map(waypoint => {
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

  const loadingDestinationFree = async region => {
    setLoadingAddress(true);
    // timeout
    if (Object.keys(destination).length > 0) {
      setLoadingAddress(false);
      return;
    }
    if (!destinationPerson) {
      setDestinationFree(origin);
      setLoadingAddress(false);
      return;
    }
    setTimeout(() => {
      handleDestinationPerson(region, setLoadingAddress)
        .then(() => {
          setLoadingAddress(false);
        })
        .finally(() => {
          setLoadingAddress(false);
        });
    }, 1000);
  };

  const listProblems = async () => {
    const response = await getListProblems();
    if (!response.status) {
      return;
    }
    setTypesProblems(response.data);
  };

  const handleChangeRegionMap = debounce(region => {
    setRegionChangeMap(region);
  }, 10);

  const isTripPartner = async () => {
    const tripPartner = JSON.parse(
      await AsyncStorage.getItem('tripPartnerList'),
    );

    return tripPartner?.find(({tripReference}) => {
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
    await getCurrentBalanceVoucher().then((data: any) => {
      setValueVoucher(data.tripBalance);
    });
  }, []);

  useEffect(() => {
    getCurrentSaldVoucher();
  }, []);

  useEffect(() => {
    if (Object.keys(trip).length > 0) {
      BackHandler.addEventListener('hardwareBackPress', () => {
        return true;
      });
    } else {
      BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('TripRoutes', {screen: 'Home'});
        return true;
      });
    }
  }, [trip]);

  useEffect(() => {
    if (destinationPerson) {
      mapRef?.current?.animateCamera({
        pitch: 0,
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

  return (
    <>
      <CardNoCity onPress={handleBack} />
      <Container>
        <Preload visible={loading} />
        <If condition={visibleLookUpAddressesModal}>
          <LookUpAddressesModal
            onBack={handleBack}
            onComplete={handleAddressesCapture}
            visible={visibleLookUpAddressesModal}
            destinationPerson={destinationPerson}
            handleBackButtonOnAddress={handleBackButtonOnAddress}
            voice={route?.params?.voice}
            typeAddress={typeAddress}
          />
        </If>

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
              mapStyle={mapStyle}
              trip={trip}
              switchsTrue={switchsTrue}
              regionChangeMap={regionChangeMap}
              hideTravelOptions={hideTravelOptions}
              destinationPerson={destinationPerson}
              destination={destination}
              waypoints={waypoints}
            />
            <ProgressBar visible={trip?.status == STATUS_BOARDING} />
            <If
              condition={
                regionChangeMap?.latitude !== undefined && hideTravelOptions
              }
            >
              <CardContainer>
                <If condition={destinationPerson}>
                  <Button
                    style={{
                      width: '100%',
                      padding: 5,
                    }}
                    onPress={() => handleSelectAddress(destinationFree)}
                    disabled={loadingAddress}
                  >
                    <TextEdit color={theme.colors.primaryText} size="medium">
                      {loadingAddress ? '...' : destinationFree?.address}
                    </TextEdit>
                  </Button>
                </If>
                <If condition={destinationPerson === false && !loadingTrip}>
                  <Button
                    style={{
                      width: '100%',
                      padding: 5,
                    }}
                    onPress={() => setDestinationPerson(true)}
                  >
                    <TextEdit color={theme.colors.primaryText} size="medium">
                      {translate('trip.text_set_location_on_map')}
                    </TextEdit>
                  </Button>
                </If>
              </CardContainer>
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
                      item => item?.key === 'enable_security_button_options',
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
                          transform: [{translateY: -20}],
                        }}
                        animate={{
                          opacity: 1,
                          transform: [{translateY: 0}],
                        }}
                        exit={{
                          opacity: 0,
                          transform: [{translateY: -20}],
                        }}
                      >
                        <TextEdit size="small">
                          {translate(
                            'panic.text_two_taps_activate_security_alert',
                          )}
                        </TextEdit>
                      </ContainerAlertPanic>
                    </If>
                  </ContainerPanic>
                </If>
              </ContainerButtonFloat>
            </If>
          </>
        )}
        <ModalOfferNewTripType
          setVisibleTravelOption={setVisibleOptionTravel}
        />
        <TravelOptions
          hide={hideTravelOptions}
          setVisibleOptionTravel={setVisibleOptionTravel}
          visibleOptionTravel={visibleOptionTravel}
          valueVoucher={valueVoucher}
        />
        <If
          condition={
            hideTravelOptions &&
            !visibleLookUpAddressesModal &&
            !offerOtherTypeTrip
          }
        >
          <TripContent setModalDriverData={setModalDriverData} />
        </If>
        <Preload visible={isLoading} />
        <ModalDataDriver
          visible={modalDriverData}
          setVisible={setModalDriverData}
        />
        <If condition={visibleProtect}>
          <ViewPanic>
            <CardPanic data={typesProblems} setVisible={setVisibleProtect} />
          </ViewPanic>
        </If>

        <ModalWho visible={visibleWho} setVisible={setVisibleWho} />
      </Container>
    </>
  );
}
