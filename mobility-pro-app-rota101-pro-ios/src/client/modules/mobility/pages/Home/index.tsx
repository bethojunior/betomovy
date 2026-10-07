import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Audio} from 'expo-av';
import * as Speech from 'expo-speech';
import {
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Dimensions,
  Animated as AnimatedNative,
  AppState,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Ionicons} from '@expo/vector-icons';
import MapView, {Marker} from 'react-native-maps';

import * as Location from 'expo-location';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

import {RFValue} from 'react-native-responsive-fontsize';
import {MotiView} from 'moti';
import {shade} from 'polished';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {
  ButtonMic,
  CardLastPlace,
  ContentAddress,
  ContentInput,
  ContentLastPlace,
  ContentModuleButton,
  DetailsContent,
  Header,
  HeaderDetails,
  ImageLarge,
  ImageSmall,
  Input,
  ModuleButtonLarge,
  ModuleButtonSmall,
  MyLocationViewer,
  ProfileImage,
  SimpleText,
  styles,
  TextLarge,
  TextSmall,
  Title,
  ViewVoice,
  ButtonCallRacer,
  TextCallRacer,
  ContentNotification,
  ContentButtonCallRacer,
  SubTitle,
  RaceSubTitle,
} from './styles';
import {useLocal} from '../../../../contexts/local';
import {useTrip} from '../../../../contexts/Trip';
import TripFinishModal from '../../../../components/TripFinishModal';
import {useModules} from '../../../../contexts/modules';
import {OfferFingerprint} from '../../../../components/OfferFingerprint';
import {useAuth} from '../../../../../context/auth';
import CardPublicity from '../../../../components/CardPublicty';
import Photo from '../../../../assets/images/user.png';
import {useTripGL} from '../../../../contexts/TripGL';
import mapStyle from '../../../../styles/map.json';
import theme from '../../../../styles/theme';
import NotificationButton from '../../../../components/NotificationButton';
import {translate} from '../../../../locales';
import {usePublicity} from '../../../../contexts/publicity';
import {TextEdit} from '../../../../components/TextEdit';
import {WebViewVoiceRecognition} from '../../../../components/WebViewVoiceRecognition';
import ModalFrame from '../../../../components/form/Modal';
import {If} from '../../../../components/If';
import {Mylocation} from '../../../../components/MyLocation';
import {useMap} from '../../../../contexts/Map';
import DriverMarker from '../../../../components/DriverMarker';

import Preload from '../../../../components/Preload';

import AnimationBell from '../../../../components/AnimationBell';
import {customToast} from '../../../../../utils/FlashMessage';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_IN_PROGRESS,
  STATUS_SCHEDULED,
} from '../../../../constants/trip';
import Push from '../../../../services/push';
import {
  convertDatetimeToDate,
  convertDatetimeToTime,
} from '../../../../utils/FormatDate';
import {TripRealtime} from '../../../../services/realtime/TripRealtime';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {buildApp} from '../../../../../constantBuild/config';
import TripPartnerInfo from '../../../../components/TripPartnerInfo';
import TripListModal from '../../../../components/TripListModal';
import {TripService} from '../../../../contexts/Trip/services';
import {TripProps} from '../../../../contexts/Trip/types';

import apiMain from '../../../../api/apiMain';
import {useDriversNears} from '../../../../../context/driversNears';

export default function Home({route}) {
  const [showTripFinishModal, setShowTripFinishModal] = useState(false);
  const [places, setPlaces] = useState([]);
  const [loadingPulblicity, setLoadingPulblicity] = useState(false);
  const [modalMic, setModalMic] = useState(false);
  const [firstBlockButtom, setFirstBlockButtom] = useState([]);
  const [secondBlockButtom, setSecondBlockButtom] = useState([]);
  const [textVoice, setTextVoice] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const mapRef = useRef<any>(null);
  const navigation = useNavigation();
  const tripRealtime = useMemo(() => new TripRealtime(), []);
  const {modulesActives, init} = useModules();
  const {
    user,
    getPermissionLocal,
    getConfigByPosition,
    offerBiometry,
    generalSettings,
    notification,
    userData,
    newActionFb,
    setNewActionFb,
    getNotification,
  } = useAuth();
  const {hasPublicity} = usePublicity();
  const {polylineCoordinates} = useTripGL();
  const {getOnlineDrivers, drivers} = useMap();
  const {
    handleTripStateChange,
    stateTripCustomer,
    dispatchTripCustomer,
    clearTrip,
  } = useTrip();
  const [tripListVisibility, setTripListVisibility] = useState(false);

  const {
    completedTripData,
    origin: originData,
    tripPartnerList,
    partnerTripsReference,
    trip,
  } = stateTripCustomer;
  const {
    position,
    setPosition,
    setLastPlaceSelected,
    lastPlaceSelected,
    placeUser,
  } = useLocal();
  const fadeAnim = useRef(new AnimatedNative.Value(1)).current;

  const {getDriversOnline, driversNears} = useDriversNears();

  useEffect(() => {
    if (
      modulesActives.length !== 0 &&
      modulesActives[0].moduleName === 'Mobilidade'
    ) {
      // @ts-ignore
      modulesActives.splice(modulesActives[0], 1);
    }

    if (modulesActives.length > 2) {
      setFirstBlockButtom([...modulesActives].splice(0, 2));

      if (modulesActives.length > 0) {
        setSecondBlockButtom(
          [...modulesActives].splice(2, modulesActives.length),
        );
      }
    } else {
      setFirstBlockButtom([...modulesActives].splice(0, 2));
    }
  }, [modulesActives]);

  const updateTripPartnerList = (trips: TripProps[]) => {
    dispatchTripCustomer({
      type: 'update',
      field: 'tripPartnerList',
      arg: trips,
    });

    if (trips.length > 0) {
      return AsyncStorage.setItem('tripPartnerList', JSON.stringify(trips));
    }
    AsyncStorage.removeItem('tripPartnerList');
  };

  const verifyTripPartnerList = async () => {
    const tripsLocal = [];
    const trips = JSON.parse(await AsyncStorage.getItem('tripPartnerList'));
    const tripLocal = JSON.parse(await AsyncStorage.getItem('trip'));

    await trips?.map(async ({tripReference}) => {
      const alredIn = partnerTripsReference?.find(ref => {
        return ref === tripReference;
      });

      if (!alredIn) {
        tripRealtime.getTrip(tripReference, async (trip, type) => {
          if (type === 'removed') {
            const tripReferences = partnerTripsReference?.filter(
              tripReference => {
                tripReference !== trip.tripReference;
              },
            );

            // partnerTripsReference = tripReferences

            const trips = await tripLocal?.filter(tripPartner => {
              return tripPartner.tripReference !== trip.tripReference;
            });

            updateTripPartnerList(trips);
          }
        });
      }

      if (tripReference === tripLocal?.tripReference) {
        AsyncStorage.removeItem('trip');
        clearTrip();
      }

      const trip = await TripService.get(tripReference);
      if (
        [STATUS_ACCEPTED, STATUS_BOARDING, STATUS_IN_PROGRESS].includes(
          trip?.status,
        )
      ) {
        tripsLocal.push(trip);
      }
    });

    dispatchTripCustomer({
      type: 'update',
      field: 'tripPartnerList',
      arg: tripsLocal,
    });
  };

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      await BarCodeScanner.requestPermissionsAsync();
    };
    getBarCodeScannerPermissions();

    verifyTripPartnerList();
  }, []);

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
    if (placeUser && !originData.address)
      dispatchTripCustomer({
        type: 'update',
        field: 'origin',
        arg: {
          address: placeUser?.address,
          latitude: placeUser?.latitude,
          longitude: placeUser?.longitude,
          street: placeUser?.street || null,
          type: placeUser?.type,
        },
      });
  }, [placeUser]);

  useEffect(() => {
    if (newActionFb.length > 0) {
      if (newActionFb === 'newNotificationApp') {
        getNotification();
        setNewActionFb('');
      }
    }
  }, [newActionFb]);

  useEffect(() => {
    setLoading(true);
    if (Platform.OS === 'ios') {
      getPermissionLocal().then(() => {
        Location.getLastKnownPositionAsync()
          .then(location => {
            if (location) {
              setPosition({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
              setLoading(false);
            } else {
              Location.getCurrentPositionAsync({accuracy: 1}).then(
                ({coords}) => {
                  setPosition({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                  });
                },
              );
              setLoading(false);
            }
          })
          .catch(error => {
            console.error('Erro ao obter a localização:', error);
            setLoading(false);
          });
      });
    }
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') {
        getPermissionLocal().then(() => {
          Location.getLastKnownPositionAsync().then(location => {
            if (location) {
              setPosition({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
              setLoading(false);
            } else {
              Location.getCurrentPositionAsync({accuracy: 1}).then(
                ({coords}) => {
                  setPosition({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                  });
                },
              );
              setLoading(false);
            }
          });
        });
      }
    });
    return () => listener.remove();
  }, []);

  useEffect(() => {
    tripRealtime.checkTripAcceptedScheduled(
      user.idUser,
      STATUS_SCHEDULED,
      (trip, type) => {
        if (type === 'modified') {
          if (trip?.driver) {
            customToast(
              `${trip?.driver?.name} ${translate(
                'schedule.accepted_your_service_from',
              )} ${convertDatetimeToDate(
                trip?.schedule?.schedule,
              )} - ${convertDatetimeToTime(trip?.schedule?.schedule)} `,
              'success',
              6000,
            );
            Push.sendSimple({
              title: `${translate('schedule.accepted_service')}`,
              message: '',
              body: `${translate(
                'schedule.your_service_scheduled_at',
              )} ${convertDatetimeToDate(
                trip?.schedule?.schedule,
              )} - ${convertDatetimeToTime(trip?.schedule?.schedule)}`,
            });
            return;
          }
          if (!trip?.driver) {
            Push.sendSimple({
              title: `${translate('finishTrip.text_trip_cancelled_by_driver')}`,
              message: '',
              body: `${translate(
                'schedule.your_service_scheduled_at',
              )} ${convertDatetimeToDate(
                trip?.schedule?.schedule,
              )} - ${convertDatetimeToTime(trip?.schedule?.schedule)}`,
            });
          }
        }
      },
    );
  }, []);

  const lastPlaces = async () => {
    setLoading(true);
    try {
      const request = await AsyncStorage.getItem('lastPlaces');
      if (request) {
        // setPlaces(JSON.parse(lastPlaces).reverse());
        const parse = await JSON.parse(request);
        const response = await indicatorsWithFilterId(parse.reverse());
        setPlaces(response);
        setLoading(false);
        return response;
      }
      setLoading(false);
      return [];
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const indicatorsWithFilterId = useCallback(list => {
    const newList = list
      .filter(item => {
        return item.latitude !== null;
      })
      .map(item => {
        return {
          ...item,
          item_latitude: item.latitude,
        };
      })
      .filter((item, index, self) => {
        return self.findIndex(t => t.item_latitude === item.latitude) === index;
      });
    setPlaces(newList);
    return newList;
  }, []);

  useEffect(() => {
    lastPlaces();
  }, [lastPlaceSelected]);

  useEffect(() => {
    if (position) {
      getConfigByPosition(position);
      getOnlineDrivers(position?.latitude, position?.longitude);
    }
  }, [position]);

  useEffect(() => {
    if (navigation) {
      const unsubscribe = navigation.addListener('focus', () =>
        handleTripStateChange(),
      );

      return route?.params?.noUnsubscribe ? undefined : unsubscribe;
    }
    return () => {};
  }, [navigation, route.params?.noUnsubscribe]);

  useEffect(() => {
    if (completedTripData) {
      setTimeout(() => {
        setShowTripFinishModal(true);
      }, 400);
    }
    return setShowTripFinishModal(false);
  }, [completedTripData]);

  useEffect(() => {
    if (position) {
      getDriversOnline(Number(position?.latitude), Number(position?.longitude));
    }
  }, [position]);

  async function requestMicrophonePermission() {
    setLoading(true);
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  useEffect(() => {
    requestMicrophonePermission();
    if (textVoice) {
      setLoadingVoice(true);
      setTimeout(() => {
        setLoadingVoice(false);
        setModalMic(false);
        setTextVoice('');
        navigation.navigate('TripRoutes', {
          screen: 'Trip',
          params: {
            voice: textVoice,
          },
        });
      }, 1000);
    }
  }, [textVoice]);

  const speakUnicMessage = async () => {
    setLoading(true);
    try {
      await Speech.speak(
        `Ola ${
          user?.nameUser?.split(' ')[0] || user?.nickname
        } para onde quer ir ? `,
        {
          language: 'pt-BR',
          rate: 0.8,
          // rate: rate,
        },
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const haveNotification = () => {
    if (
      notification.length !== 0 &&
      notification.some((item: any) => item.viewed === '0')
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    haveNotification;
  }, [notification]);

  const handleRedirectTripsSpeedMob = () => {
    setTimeout(() => {
      navigation.navigate('TripRoutes', {screen: 'TripSpeedMob'});
    }, 300);
    fadeOut();
  };

  const fadeIn = () => {
    AnimatedNative.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    AnimatedNative.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const Pulse = ({delay = 0, repeat}) => {
    const animation = useSharedValue(init === 'Speedmob' ? 3.5 : 0.7);
    useEffect(() => {
      animation.value = withDelay(
        delay,
        withRepeat(
          withTiming(init === 'Speedmob' ? 5 : 1, {
            duration: init === 'Speedmob' ? 1000 : 2400,
            easing: Easing.linear,
          }),
          repeat ? -1 : 1,
          false,
        ),
      );
    }, []);
    const animatedStyles = useAnimatedStyle(() => {
      const opacity = interpolate(
        animation.value,
        [init === 'Speedmob' ? 2 : 2, 5],
        [0.6, 0],
        Extrapolate.CLAMP,
      );
      return {
        opacity,
        transform: [{scale: animation.value}],
      };
    });

    return (
      <Animated.View
        style={[
          init === 'Speedmob'
            ? [
                styles.circleSpeedMob,
                {
                  backgroundColor: theme.colors.primary,
                  borderColor: theme.colors.primary,
                },
              ]
            : styles.circle,
          animatedStyles,
        ]}
      />
    );
  };

  useEffect(() => {
    !modalMic && setTextVoice(null);
  }, [modalMic]);

  useEffect(() => {
    textVoice === '' && setModalMic(false);
  }, [textVoice]);

  useFocusEffect(
    useCallback(() => {
      fadeIn();
    }, []),
  );

  const monitoringInfoDataUser = useCallback(() => {
    if (userData === undefined) return;
    if (
      !userData?.document ||
      !user.profileImage ||
      !userData?.dateOfBirth ||
      user.profileImage === 'user.png'
    ) {
      customToast(translate('trip.alert_document_incomplete'), 'warning');
      navigation.navigate('MyProfile');
    }
  }, [userData, user]);

  useFocusEffect(monitoringInfoDataUser);

  return (
    <View style={{flex: 1}}>
      <Preload visible={loading} />
      <Modal visible={offerBiometry}>
        <OfferFingerprint />
      </Modal>
      <TripFinishModal
        setVisible={setShowTripFinishModal}
        visible={showTripFinishModal}
        closeModal={() => {
          setShowTripFinishModal(false);
          dispatchTripCustomer({
            type: 'update',
            field: 'completedTripData',
            arg: undefined,
          });
        }}
      />
      <If condition={tripPartnerList?.length > 0}>
        <TripPartnerInfo setVisible={setTripListVisibility} />
      </If>
      <If condition={tripListVisibility}>
        <TripListModal
          visible={tripListVisibility}
          setVisible={setTripListVisibility}
          trips={tripPartnerList}
        />
      </If>
      <View
        style={{
          flex: 1,
          position: 'relative',
        }}
      >
        {position && (
          <MapView
            ref={mapRef}
            minZoomLevel={15}
            initialRegion={{
              latitude: position.latitude,
              longitude: position.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.001,
            }}
            style={{
              flex: 1,
              height: Dimensions.get('window').height,
              width: '100%',
              position: 'absolute',
            }}
            showsUserLocation={!polylineCoordinates}
            showsMyLocationButton={false}
            showsCompass={false}
            customMapStyle={Platform.OS === 'ios' ? null : mapStyle}
          >
            {driversNears &&
              Object.keys(trip).length <= 0 &&
              driversNears.length > 0 &&
              driversNears.map((driver, index) => {
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: Number(driver.latitude),
                      longitude: Number(driver.longitude),
                    }}
                    anchor={{x: 0.5, y: 0.5}}
                  >
                    <Image
                      style={{
                        width: RFValue(28),
                        height: RFValue(28),
                      }}
                      source={
                        driver.iconMapDriver === null
                          ? require('../../../../assets/images/car.png')
                          : {
                              uri: driver.iconMapDriver,
                            }
                      }
                      resizeMode="contain"
                    />
                  </Marker>
                );
              })}
          </MapView>
        )}

        <Header>
          {init !== 'Speedmob' && (
            <>
              <View
                style={{
                  width: 220,
                }}
              >
                <SimpleText>{translate('home.text_hello')}</SimpleText>
                <SimpleText style={{fontSize: 25}}>
                  {user
                    ? user?.nameUser?.split(' ')[0]
                    : translate('home.text_welcome')}
                  !
                </SimpleText>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.8}
              >
                <ProfileImage
                  source={
                    user?.profileImage
                      ? {
                          uri:
                            buildApp().HOST_IMAGE_CUSTOMER + user?.profileImage,
                        }
                      : Photo
                  }
                />
              </TouchableOpacity>
            </>
          )}

          {init === 'Speedmob' && (
            <>
              <AnimationBell
                colorBadge={theme.colors.primary}
                isBadge
                startAnimation={haveNotification()}
              >
                <ContentNotification
                  onPress={() =>
                    navigation.navigate('NotificationUserSpeedMob')
                  }
                >
                  <Ionicons
                    name="notifications"
                    color={theme.colors.primary}
                    size={35}
                  />
                </ContentNotification>
              </AnimationBell>

              <ContentNotification
                onPress={() => navigation.navigate('ProfileSpeedMob')}
              >
                <Ionicons name="menu" color={theme.colors.primary} size={35} />
              </ContentNotification>
            </>
          )}
        </Header>
        {init !== 'Speedmob' && (
          <>
            <DetailsContent>
              <MyLocationViewer
                backgroundColor={theme.colors.primary}
                onPress={() => {
                  if (position) {
                    mapRef?.current?.animateToRegion({
                      latitude: position?.latitude,
                      longitude: position?.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.001,
                    });
                  }
                }}
                activeOpacity={0.8}
              >
                <Mylocation onPress={() => true} />
              </MyLocationViewer>
              <ScrollView>
                <View>
                  <HeaderDetails>
                    <ScrollView>
                      <Title>
                        {generalSettings.find(
                          item => item?.key === 'title_for_home',
                        )?.value || translate('home.text_lets_find')}
                      </Title>
                      {/* <View style={{flexDirection: 'row'}}>
                        <SubTitle>{translate('home.text_one')}</SubTitle>
                        <RaceSubTitle>
                          {translate('home.text_trip')}
                        </RaceSubTitle>
                      </View> */}
                    </ScrollView>
                    <NotificationButton />
                  </HeaderDetails>
                  <View>
                    <ContentAddress>
                      <ContentInput>
                        <Input
                          onPress={() => {
                            navigation.navigate('TripRoutes', {screen: 'Trip'});
                          }}
                        >
                          <Ionicons
                            name="search"
                            size={20}
                            color={theme.colors.primary}
                          />
                          <SimpleText style={{marginLeft: 10}}>
                            {translate('home.text_where_we_go')}
                          </SimpleText>
                        </Input>
                        <ButtonMic
                          style={{
                            shadowColor: theme.colors.black,
                            shadowOffset: {
                              width: 0,
                              height: 3,
                            },
                            shadowOpacity: 0.29,
                            shadowRadius: 4.65,

                            elevation: 7,
                          }}
                          activeOpacity={0.9}
                          onPress={() => {
                            speakUnicMessage();
                            setModalMic(true);
                          }}
                        >
                          {[1].map((item, index) => (
                            <Pulse repeat={index === 0} key={index} />
                          ))}
                          <Ionicons
                            name="mic"
                            color={theme.colors.primary}
                            size={RFValue(30)}
                            style={{
                              zIndex: 5,
                              height: '100%',
                              marginTop: '30%',
                              marginLeft: 2,
                              alignSelf: 'center',
                            }}
                          />
                        </ButtonMic>
                      </ContentInput>

                      {!hasPublicity && places.length > 0 && (
                        <ContentLastPlace
                          hasPlaces={Boolean(places.length) && !hasPublicity}
                        >
                          {places
                            .filter(item => item.latitude)
                            .map((addressResult, index) => {
                              return (
                                <CardLastPlace
                                  hasBorder={index !== places.length - 1}
                                  key={index}
                                  onPress={() => {
                                    setLastPlaceSelected({
                                      address: addressResult.address,
                                      latitude: addressResult.latitude,
                                      longitude: addressResult.longitude,
                                      street: addressResult.street || null,
                                      type: addressResult.type || null,
                                    });
                                    navigation.navigate('TripRoutes', {
                                      screen: 'Trip',
                                    });
                                  }}
                                >
                                  <SimpleLineIcons
                                    name="clock"
                                    size={15}
                                    color={theme.colors.primary}
                                    style={{marginRight: 10}}
                                  />
                                  <TextEdit
                                    size={`smalls`}
                                    color={theme.colors.secondary}
                                  >
                                    {addressResult?.address}
                                  </TextEdit>
                                </CardLastPlace>
                              );
                            })}
                        </ContentLastPlace>
                      )}
                    </ContentAddress>
                  </View>
                </View>
                <View>
                  <ContentModuleButton>
                    {firstBlockButtom.length !== 0 &&
                      firstBlockButtom.map((item, index) => (
                        <ModuleButtonLarge
                          activeOpacity={0.8}
                          onPress={() => navigation.navigate(item.moduleName)}
                          key={index}
                        >
                          <TextLarge>{item.moduleName}</TextLarge>
                          <ImageLarge source={{uri: item.logo}} />
                        </ModuleButtonLarge>
                      ))}
                  </ContentModuleButton>
                  <ContentModuleButton>
                    {secondBlockButtom.length !== 0 &&
                      secondBlockButtom.map((item, index) => (
                        <ModuleButtonSmall
                          activeOpacity={0.8}
                          onPress={() => navigation.navigate(item.moduleName)}
                          key={index}
                        >
                          <TextSmall>{item.moduleName}</TextSmall>
                          <ImageSmall source={{uri: item.logo}} />
                        </ModuleButtonSmall>
                      ))}
                  </ContentModuleButton>
                </View>
                {hasPublicity && (
                  <View style={{marginTop: 20, marginBottom: 20}}>
                    <CardPublicity
                      appConstPublicity={4}
                      setLoading={setLoadingPulblicity}
                    />
                  </View>
                )}
              </ScrollView>
            </DetailsContent>
          </>
        )}

        {init === 'Speedmob' && (
          <ContentButtonCallRacer>
            <AnimatedNative.View style={[{opacity: fadeAnim}]}>
              <ButtonCallRacer onPress={handleRedirectTripsSpeedMob}>
                {[1].map((item, index) => (
                  <Pulse repeat={index === 0} key={index} />
                ))}
                <TextCallRacer>
                  {translate('homeSpeedmobClient.title_button_call')}
                </TextCallRacer>
              </ButtonCallRacer>
            </AnimatedNative.View>
          </ContentButtonCallRacer>
        )}
      </View>

      <ModalFrame
        onClose={() => {
          setTextVoice('');
          setLoadingVoice(false);
          setModalMic(false);
        }}
        title={translate('addAddressMap.text_talk_address')}
        visible={modalMic}
        setVisible={setModalMic}
        hideConfirm
      >
        <ViewVoice>
          <If condition={loadingVoice}>
            <MotiView
              from={{
                opacity: 0,
                scale: 0.5,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                type: 'timing',
                duration: 500,
                loop: true,
              }}
              style={{
                width: RFValue(100),
                height: RFValue(100),
                borderRadius: RFValue(100),
                backgroundColor: shade(0.08, theme.colors.background_global),
                position: 'absolute',
              }}
            />
          </If>

          {/* <IfLoaderInsideScreen loading={loadingVoice}> */}
          <Ionicons
            name="mic"
            color={!loadingVoice ? theme.colors.primary : theme.colors.red}
            size={RFValue(80)}
            style={{
              marginLeft: 5,
            }}
          />
          {/* </IfLoaderInsideScreen> */}

          <WebViewVoiceRecognition
            setText={setTextVoice}
            text={textVoice}
            width={1}
            setStartLoading={setLoadingVoice}
            height={1}
            sizeIcon={1}
            automatic
          />
        </ViewVoice>
      </ModalFrame>
    </View>
  );
}
