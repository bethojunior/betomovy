/* eslint-disable @typescript-eslint/no-shadow */
// @ts-nocheck
import {useCallback, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {useNavigation} from '@react-navigation/native';

import {Button} from 'react-native-paper';
import {Image} from 'react-native';
import {Audio} from 'expo-av';
import {useTrip} from '../../../contexts/Trip';
import {useLocal} from '../../../contexts/local';
import LookUpAddressesModal from '../../../components/LookUpAddressesModal';
import TravelOptions from '../../../components/TravelOptions';

import mapStyle from '../../../styles/map.json';
import {
  CardContainer,
  Container,
  ContainerAlertPanic,
  ContainerButtonFloat,
  ContainerDuration,
  ContainerPanic,
  ViewPanic,
  ContentOptionsTrip,
  TextAddressMenu,
  ButtonAddressMenu,
  ButtonDeleteAddress,
  TextButtonDeleteAddress,
  ContentAddressMenu,
} from './styles';
import TripContent from '../../../components/TripContent';
import Preload from '../../../components/Preload';
import DriverMarker from '../../../components/DriverMarker';
import DestinationRoute from '../../../components/DestinationRoute';
import theme from '../../../styles/theme';
import {If} from '../../../components/If';
import {ModalDataDriver} from '../../../components/ModalDataDriver';
import {TextEdit} from '../../../components/TextEdit';
import apiMain from '../../../api/apiMain';
import {CardPanic} from '../../../components/CardPanic';
import {usePanic} from '../../../contexts/Panic';
import {translate} from '../../../locales';
import {ModalWho} from '../../../components/ModalWho';
import {useAuth} from '../../../../context/auth';
import {MarkerLabel} from '../../../components/MarkerLabel';
import {usePaymentForm} from '../../../contexts/paymentForms';
import {
  STATUS_BOARDING,
  STATUS_FINISHED,
  STATUS_IN_PROGRESS,
  STATUS_SCHEDULED,
  STATUS_SEARCHING,
} from '../../../constants/trip';
import Helper from '../../../utils/Helper';
import {FloatButton} from '../../../components/FloatButton';
import {ProgressBar} from '../../../components/ProgressBar';
import SearchAddressModal from '../../../components/SearchAddressModal';

import {useModules} from '../../../contexts/modules';

import ItemsTripSpeedMob from '../../../components/ItemsTripSpeedMob';
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
} from '@expo/vector-icons';

interface TypeProps {
  id: number;
  name: string;
  statusId: string;
}

export interface AddressesUserProps {
  address: string;
  cityId: string | null;
  created_at: Date;
  id: string | null;
  latitude: string;
  longitude: string;
  neighborhood: any;
  proximity: string;
  relevance: string;
  type: string;
  street?: string;
}

// Essa variavel local e necessaria, pois , quando se coloca no onRegionChange um valor set, ele da muitas requisicoes de callback
// let regionChange = {};

export default function Trip({route}) {
  const mapRef = useRef(null);
  const {position} = useLocal();
  const {partner, generalSettings} = useAuth();
  const {getListProblems} = usePanic();
  const {getCurrentBalanceVoucher} = usePaymentForm();
  const [typesProblems, setTypesProblems] = useState<TypeProps[]>([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [modalDriverData, setModalDriverData] = useState(false);
  const [monitoringAnimation, setMonitoringAnimation] = useState(false);
  const regionChange = useRef({
    latitude: position?.latitude,
    longitude: position?.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [visibleProtect, setVisibleProtect] = useState(false);
  const [visibleAlertProtect, setVisibleAlertProtect] = useState(false);
  const [visibleWho, setVisibleWho] = useState(false);
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
  const [firstLoad, setFirstLoad] = useState(false);
  const [destinationFree, setDestinationFree] = useState({});
  const [valueVoucher, setValueVoucher] = useState(0);
  const countClick = useRef(0);

  const {modulesActives, init} = useModules();

  const [loading, setLoading] = useState<boolean>(false);
  const [typeAddressMenu, setTypeAddressMenu] = useState<
    'home' | 'work' | 'favorite'
  >('home');

  const [addressHomePassenger, setAddressHomePassenger] =
    useState<AddressesUserProps | null>(null);
  const [addressWorkPassenger, setAddressWorkPassenger] =
    useState<AddressesUserProps | null>(null);
  const [addressFavoritePassenger, setAddressFavoritePassenger] =
    useState<AddressesUserProps | null>(null);

  const [showMap, setShowMap] = useState<boolean>(false);

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
  } = stateTripCustomer;

  const navigation = useNavigation();

  const searchAddressModal = useRef(null);

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
    mapRef?.current?.animateCamera({
      center: {
        latitude: position.latitude,
        longitude: position.longitude,
      },
      zoom: 19,
      heading: 0,
      pitch: 90,
    });
  }, [position, destination]);

  const handleMapAnimation = async () => {
    const duration = parseInt(distance) + 2.0;
    const durationUse = duration.toPrecision(4);
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
    Helper.timeout(3500).then(async () => {
      await mapRef.current?.fitToCoordinates(lastPolylineCoordinates, {
        animated: true,
      });
    });
    await Helper.timeout(6000).then(() => {
      mapRef.current?.animateCamera(
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
    });

    await Helper.timeout(6100).then(() => {
      mapRef.current?.fitToCoordinates(lastPolylineCoordinates, {
        animated: true,
      });
    });
    // Deixando em LOOP
    await Helper.timeout(8000).then(() => {
      setMonitoringAnimation(!monitoringAnimation);
    });
  };

  useEffect(() => {
    if (trip.status === STATUS_SEARCHING && distance > 0) {
      handleMapAnimation();
    }
  }, [trip, monitoringAnimation, distance]);

  useEffect(() => {
    if (polylineCoordinates) {
      if (trip.status === STATUS_SEARCHING) {
      } else if (
        trip.status !== STATUS_IN_PROGRESS ||
        trip.status !== STATUS_FINISHED
      ) {
        mapRef?.current?.animateCamera({
          center: {
            latitude: destination.latitude,
            longitude: destination.longitude,
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
      }
    }
  }, [polylineCoordinates, trip]);

  useEffect(() => {
    (async () => {
      const {status} = await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      if (status !== 'granted') {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
      }
    })();
  }, []);

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

  const getAdresses = async () => {
    setLoading(true);
    try {
      const responseAddressHome = await AsyncStorage.getItem(
        '@speedmob:addressHomePassenger',
      );
      const responseAddressWork = await AsyncStorage.getItem(
        '@speedmob:addressWorkPassenger',
      );
      const responseAddressFavorite = await AsyncStorage.getItem(
        '@speedmob:addressFavoritePassenger',
      );

      setAddressHomePassenger(JSON.parse(responseAddressHome));
      setAddressWorkPassenger(JSON.parse(responseAddressWork));
      setAddressFavoritePassenger(JSON.parse(responseAddressFavorite));
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

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

  const handleAddressSelected = async (addressResult, type) => {
    setLoading(true);
    try {
      if (typeAddressMenu === 'home') {
        await AsyncStorage.setItem(
          '@speedmob:addressHomePassenger',
          JSON.stringify(addressResult),
        );
      } else if (typeAddressMenu === 'work') {
        await AsyncStorage.setItem(
          '@speedmob:addressWorkPassenger',
          JSON.stringify(addressResult),
        );
      } else if (typeAddressMenu === 'favorite') {
        await AsyncStorage.setItem(
          '@speedmob:addressFavoritePassenger',
          JSON.stringify(addressResult),
        );
      }

      getAdresses();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleDeleteAddressSelected = async (
    type: 'home' | 'work' | 'favorite',
  ) => {
    setLoading(true);
    try {
      if (type === 'home') {
        await AsyncStorage.removeItem('@speedmob:addressHomePassenger');
      } else if (type === 'work') {
        await AsyncStorage.removeItem('@speedmob:addressWorkPassenger');
      } else if (type === 'favorite') {
        await AsyncStorage.removeItem('@speedmob:addressFavoritePassenger');
      }

      getAdresses();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleSelectAddress = (datas?: AddressesUserProps) => {
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

  const getCurrentSaldVoucher = useCallback(async () => {
    await getCurrentBalanceVoucher().then((data: any) => {
      setValueVoucher(data.tripBalance);
    });
  }, []);

  useEffect(() => {
    getCurrentSaldVoucher();
    listProblems();
    getAdresses();
  }, []);

  useEffect(() => {
    if (origin && Object.keys(origin).length > 0) {
      dispatchTripCustomer({
        type: 'update',
        field: 'lastOrigin',
        arg: origin,
      });
    }
  }, [origin]);

  useEffect(() => {
    const isShowMapDestinationAndOrigin =
      Object.keys(destination).length > 0 ||
      (trip && Object.keys(trip).length > 0);
    setShowMap(isShowMapDestinationAndOrigin);
  }, [trip, destination]);

  return (
    <Container>
      <If condition={visibleLookUpAddressesModal}>
        <LookUpAddressesModal
          isSpeedMob={init === 'Speedmob'}
          onBack={handleBack}
          onComplete={handleAddressesCapture}
          visible={visibleLookUpAddressesModal}
          destinationPerson={destinationPerson}
          voice={route?.params?.voice}
        />
      </If>

      {position && showMap && (
        <>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            mapPadding={{
              bottom: 20,
              top: 80,
              left: 20,
              right: 20,
            }}
            showsCompass={false}
            onLayout={() => {
              if (!firstLoad) {
                mapRef?.current?.animateCamera({
                  center: {
                    latitude: position.latitude,
                    longitude: position.longitude,
                  },
                  zoom: 19,
                  heading: 0,
                  pitch: 90,
                });
                setFirstLoad(true);
              }
            }}
            onPress={() => setVisibleProtect(false)}
            initialRegion={!polylineCoordinates ? region : region}
            onRegionChange={region => {
              regionChange.current = region;
            }}
            onRegionChangeComplete={region => {
              loadingDestinationFree(region);
            }}
            style={{flex: 1}}
            showsUserLocation={false}
            showsMyLocationButton={false}
            customMapStyle={mapStyle}
          >
            {trip && !trip?.driverId && (
              <Marker
                coordinate={{
                  latitude:
                    Object.keys(lastOrigin).length > 0 === false
                      ? position.latitude
                      : Number(lastOrigin.latitude),
                  longitude:
                    Object.keys(lastOrigin).length > 0 === false
                      ? position.longitude
                      : Number(lastOrigin.longitude),
                }}
                importantForAccessibility="no-hide-descendants"
              >
                <Image
                  style={{
                    width: 35,
                    height: 35,
                  }}
                  source={require('../../../assets/images/pinBlue3D.png')}
                />
              </Marker>
            )}

            {regionChange.current.latitude !== undefined &&
              hideTravelOptions &&
              destinationPerson &&
              Object.keys(destination).length === 0 && (
                <Marker
                  coordinate={{
                    latitude: regionChange?.current.latitude,
                    longitude: regionChange?.current.longitude,
                  }}
                  title={translate('trip.text_your_local')}
                  description={translate('trip.text_your_local')}
                  importantForAccessibility="no-hide-descendants"
                >
                  <Image
                    style={{
                      width: 35,
                      height: 35,
                    }}
                    source={require('../../../assets/images/pin3d.png')}
                  />
                </Marker>
              )}
            {waypoints?.length > 0 &&
              waypoints?.map(
                waypoint =>
                  waypoint?.latitude && (
                    <Marker
                      key={waypoint?.id}
                      coordinate={{
                        latitude: parseFloat(waypoint?.latitude),
                        longitude: parseFloat(waypoint?.longitude),
                      }}
                    >
                      <Image
                        style={{
                          width: 35,
                          height: 35,
                        }}
                        source={require('../../../assets/images/pin3d.png')}
                      />
                    </Marker>
                  ),
              )}
            {destination.latitude && !hideTravelOptions && (
              <MarkerLabel local={destination} address={destination?.address} />
            )}
            {polylineCoordinates && (
              <Polyline
                coordinates={polylineCoordinates}
                strokeColor={theme.colors.black}
                strokeWidth={3}
              />
            )}
            <DriverMarker />
            <DestinationRoute />
          </MapView>
          <ProgressBar visible={trip?.status == STATUS_BOARDING} />
          <If
            condition={
              regionChange?.current.latitude !== undefined && hideTravelOptions
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
                  <TextEdit color={theme.colors.white} size="medium">
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
                  {/* <TextEdit color={theme.colors.white} size="medium">
                    {translate('trip.text_set_location_on_map')}
                  </TextEdit> */}
                </Button>
              </If>
            </CardContainer>
          </If>

          <If condition={distance}>
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
                    item => item.key === 'enable_security_button_options',
                  ).value === '1' &&
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
                          color: theme.colors.background_global,
                        }}
                      />
                    }
                    onPress={() => {
                      // eslint-disable-next-line no-plusplus
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

      <SearchAddressModal
        handleAddressSelected={(addressResult, type) => {
          handleAddressSelected(addressResult, type);
        }}
        isSpeedMob={init === 'Speedmob'}
        ref={searchAddressModal}
      />

      {!showMap && (
        <ContentOptionsTrip>
          {addressHomePassenger ? (
            <ContentAddressMenu>
              <ButtonAddressMenu
                onPress={() => handleSelectAddress(addressHomePassenger)}
              >
                <TextAddressMenu>
                  {addressHomePassenger.address}
                </TextAddressMenu>
              </ButtonAddressMenu>
              <ButtonDeleteAddress
                onPress={() => handleDeleteAddressSelected('home')}
              >
                <TextButtonDeleteAddress>
                  <Feather name="trash" size={30} color={theme.colors.red} />
                </TextButtonDeleteAddress>
              </ButtonDeleteAddress>
            </ContentAddressMenu>
          ) : (
            <ItemsTripSpeedMob
              onPress={() => {
                searchAddressModal.current.show();
                setTypeAddressMenu('home');
              }}
              icon={
                <Ionicons name="home" size={25} color={theme.colors.primary} />
              }
              name={translate('menuTripSpeedmob.title_menu_add_home')}
            />
          )}

          {addressWorkPassenger ? (
            <ContentAddressMenu>
              <ButtonAddressMenu
                onPress={() => handleSelectAddress(addressWorkPassenger)}
              >
                <TextAddressMenu>
                  {addressWorkPassenger.address}
                </TextAddressMenu>
              </ButtonAddressMenu>
              <ButtonDeleteAddress
                onPress={() => handleDeleteAddressSelected('work')}
              >
                <TextButtonDeleteAddress>
                  <Feather name="trash" size={30} color={theme.colors.red} />
                </TextButtonDeleteAddress>
              </ButtonDeleteAddress>
            </ContentAddressMenu>
          ) : (
            <ItemsTripSpeedMob
              onPress={() => {
                searchAddressModal.current.show();
                setTypeAddressMenu('work');
              }}
              icon={
                <MaterialIcons
                  name="work"
                  size={25}
                  color={theme.colors.primary}
                />
              }
              name={translate('menuTripSpeedmob.title_menu_add_work')}
            />
          )}
          <ItemsTripSpeedMob
            onPress={() => {
              setDestinationPerson(true);
              setShowMap(true);
            }}
            icon={
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={25}
                color={theme.colors.primary}
              />
            }
            name={translate('trip.text_set_location_on_map')}
          />
          {addressFavoritePassenger ? (
            <ContentAddressMenu>
              <ButtonAddressMenu
                onPress={() => handleSelectAddress(addressFavoritePassenger)}
              >
                <TextAddressMenu>
                  {addressFavoritePassenger.address}
                </TextAddressMenu>
              </ButtonAddressMenu>
              <ButtonDeleteAddress
                onPress={() => handleDeleteAddressSelected('favorite')}
              >
                <TextButtonDeleteAddress>
                  <Feather name="trash" size={30} color={theme.colors.red} />
                </TextButtonDeleteAddress>
              </ButtonDeleteAddress>
            </ContentAddressMenu>
          ) : (
            <ItemsTripSpeedMob
              onPress={() => {
                searchAddressModal.current.show();
                setTypeAddressMenu('favorite');
              }}
              icon={
                <Ionicons name="add" size={25} color={theme.colors.primary} />
              }
              name={translate('menuTripSpeedmob.title_add_local')}
            />
          )}
        </ContentOptionsTrip>
      )}
      <TravelOptions hide={hideTravelOptions} valueVoucher={valueVoucher} />
      {hideTravelOptions && !visibleLookUpAddressesModal && (
        <TripContent setModalDriverData={setModalDriverData} />
      )}
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
  );
}
