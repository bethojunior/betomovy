import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import {
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  Animated as AnimatedNative,
  AppState,
  Platform,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

import * as Location from 'expo-location';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
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
import { useCameraPermissions } from 'expo-camera';
import {
  ButtonMic,
  ContentInput,
  DriverSearchOverlay,
  Header,
  Input,
  MapCard,
  MapCardWrapper,
  RootContainer,
  SimpleText,
  styles,
  ViewVoice,
  VoicePulse,
  ButtonCallRacer,
  TextCallRacer,
  ContentNotification,
  ContentButtonCallRacer,
} from './styles';
import { HomeBottomSheet } from './HomeBottomSheet';
import { useLocal } from '../../../../contexts/local';
import { MODULE_NAME_TO_TRIP_SCREEN, resolveModuleScreen } from '../../../../utils/moduleNavigation';
import { useFooterModuleShortcut } from '../../../../hooks/useFooterModuleShortcut';
import { useTrip } from '../../../../contexts/Trip';
import TripFinishModal from '../../../../components/TripFinishModal';
import { ModuleItem, useModules } from '../../../../contexts/modules';
import { OfferFingerprint } from '../../../../components/OfferFingerprint';
import { useAuth } from '../../../../../context/auth';
import { usePublicity } from '~/hooks/usePublicity';
import { useTripGL } from '../../../../contexts/TripGL';
import mapStyle from '../../../../styles/map.json';
import theme from '../../../../styles/theme';
import NotificationButton from '../../../../components/NotificationButton';
import { HomeMapHeader } from '../../../../components/HomeMapHeader';
import CurrentLocationMarker from '../../../../components/CurrentLocationMarker';
import { translate } from '../../../../locales';
import { WebViewVoiceRecognition } from '../../../../components/WebViewVoiceRecognition';
import ModalFrame from '../../../../components/form/Modal';

import Preload from '../../../../components/Preload';

import AnimationBell from '../../../../components/AnimationBell';
import { customToast } from '../../../../../utils/FlashMessage';
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
import TripPartnerInfo from '../../../../components/TripPartnerInfo';
import TripListModal from '../../../../components/TripListModal';
import { TripService } from '../../../../contexts/Trip/services';
import { TripProps } from '../../../../contexts/Trip/types';

import { ModalAlert } from '../../../../../driver/src/components/ModalAlert';
import { useStoragePictures } from '../../../../../driver/src/hooks/useStoragePictures';
import { CardNoCity } from '../../../../components/CardNoCity';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import DriverSearch from '../../../../components/DriverSearch';
import useTripRealtime from '../../../../hooks/tripRealtime';
import { TripCallback } from '../../../../interfaces/tripRealtime';
import CustomMarkerDriverNear from '~/components/CustomMarkerDriverNear';
import { useDriversNears } from '~/hooks/useDriversNears';
import { useActiveTrips } from '~/hooks/useActiveTrips';
import { useProfileCompletionGuard } from '~/hooks/useProfileCompletionGuard';
import { TripActive } from '~/interfaces/tripActive';
import { AvatarProfile } from '../../../../../components/AvatarProfile';
import { PIX_CACHE_KEY, TRIP_CACHE_KEY } from '~/client/constants/pixCache';
import { APP_TYPE } from '~/constants/app';
import { ADVERTISING_APP_SITE_TYPE } from '~/constants/advertisingAppSite';

const STATUS_BLOCKED = 3;
const LOCATION_TIMEOUT_MS = 2500;
const POSITION_CACHE_TTL_MS = 30000;

export default function Home() {
  useProfileCompletionGuard();

  const { tripRealtime } = useTripRealtime();
  const [currentAddress, setCurrentAddress] = useState('');
  const [showTripFinishModal, setShowTripFinishModal] = useState(false);
  const [modalMic, setModalMic] = useState(false);
  const [moduleButtons, setModuleButtons] = useState<ModuleItem[]>([]);
  const [textVoice, setTextVoice] = useState<string | null>(null);
  const [loadingVoice, setLoadingVoice] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModalVoiceRecord, setShowModalVoiceRecord] =
    useState<boolean>(false);
  const [showDriverSearchFromCache, setShowDriverSearchFromCache] = useState(false);

  const mapRef = useRef<any>(null);
  const navigation: any = useNavigation();
  const routeInfo = useRoute();

  const { modulesActives, init } = useModules();
  const footerModuleShortcut = useFooterModuleShortcut();
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
    syncDeviceToken,
  } = useAuth();
  const { polylineCoordinates } = useTripGL();
  const {
    handleTripStateChange,
    stateTripCustomer,
    dispatchTripCustomer,
    clearTrip,
    showModalNoCity,
  } = useTrip();

  const { data: tripsActives, loading: loadingTrips } = useActiveTrips({
    field: "user",
    id: user?.idUser
  });

  const { offerOtherTypeTrip } = stateTripCustomer;
  const [tripListVisibility, setTripListVisibility] = useState(false);

  const {
    completedTripData,
    origin: originData,
    tripPartnerList,
    partnerTripsReference,
    timeExceededFee,
    showModalNoCity: globalShowModalNoCity,
  } = stateTripCustomer;
  const {
    position,
    setPosition,
    placeUser,
  } = useLocal();

  const { data: publicityList } = usePublicity({
    position,
    typeConst: APP_TYPE.CLIENT_FINAL,
    advertisingAppSiteId: ADVERTISING_APP_SITE_TYPE.ABERTURA,
    genderId: user.genderId
  });

  const fadeAnim = useRef(new AnimatedNative.Value(1)).current;

  const { openApp } = useBubbleButton();
  const { width } = useWindowDimensions();

  const { data: driversNears } = useDriversNears({
    latitude: position?.latitude,
    longitude: position?.longitude,
  });

  const { getStoragePictureSpecific } = useStoragePictures();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const isResolvingInputPress = useRef(false);
  const positionCache = useRef<{ coords: { latitude: number; longitude: number }; address: string; timestamp: number } | null>(null);

  const authorizedTravelUser = async () => {
    if (Number(user.customerRegisterStatusId) === STATUS_BLOCKED) {
      customToast(
        translate('home.authorization'),
        'warning',
      );
      return false;
    }

    return true;
  }

  const handleInputPress = async () => {
    // Lock contra toques repetidos (evita várias getCurrentPositionAsync concorrentes travando o app)
    if (isResolvingInputPress.current) return;
    isResolvingInputPress.current = true;

    if (!await authorizedTravelUser()) {
      isResolvingInputPress.current = false;
      return;
    }

    try {
      const cached = positionCache.current;
      const cacheIsFresh = cached && Date.now() - cached.timestamp < POSITION_CACHE_TTL_MS;

      if (cacheIsFresh) {
        setPosition(cached.coords);
        setCurrentAddress(cached.address);
      } else {
        const permission = await getPermissionLocal();
        if (permission) {
          // Desiste e navega mesmo assim se o GPS demorar demais
          const location = await Promise.race([
            Location.getCurrentPositionAsync({ accuracy: 1 }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('location_timeout')), LOCATION_TIMEOUT_MS),
            ),
          ]);
          const address = await Location.reverseGeocodeAsync(location.coords);
          const { street, name, city, region, country, postalCode, streetNumber } = address[0];
          const formattedAddress = `${street || name || ''} ${streetNumber || ''}, ${city || ''}, ${region || ''}, ${country || ''}`.replace(/, ,/g, ',').replace(/, $/, '').replace(/^, /, '');
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          positionCache.current = { coords, address: formattedAddress, timestamp: Date.now() };
          setPosition(coords);
          setCurrentAddress(formattedAddress);
        }
      }
    } catch (error) {
      console.error('Erro ao obter a localização:', error);
    } finally {
      navigation.navigate('TripRoutes', { screen: 'Trip' });
      isResolvingInputPress.current = false;
    }
  };

  const handleModulePress = (moduleName: string) => {
    if (MODULE_NAME_TO_TRIP_SCREEN[moduleName]) {
      navigation.navigate('TripRoutes', { screen: resolveModuleScreen(moduleName) });
      return;
    }

    navigation.navigate(resolveModuleScreen(moduleName));
  };

  useEffect(() => {
    if (currentAddress) {
      dispatchTripCustomer({
        type: 'update',
        field: 'origin',
        arg: {
          address: currentAddress,
          latitude: position.latitude,
          longitude: position.longitude,
          street: currentAddress || null,
          type: 'origin',
        },
      });
    }
  }, [currentAddress, position]);

  useEffect(() => {
    if (
      modulesActives.length !== 0 &&
      modulesActives[0].moduleName === 'Mobilidade'
    ) {
      // @ts-ignore
      modulesActives.splice(modulesActives[0], 1);
    }

    // Módulo já exibido como atalho no footer (só existe quando é o único
    // extra ativo) não repete aqui no grid — ver useFooterModuleShortcut.
    const gridModules = footerModuleShortcut
      ? modulesActives.filter(
          (module: {moduleName: string}) => module.moduleName !== footerModuleShortcut.moduleName,
        )
      : modulesActives;

    setModuleButtons([...gridModules]);
  }, [modulesActives, footerModuleShortcut]);

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

  const handleVerifyTripPartnerList = async (): Promise<void> => {
    const tripsLocal = [];
    const trips = JSON.parse(await AsyncStorage.getItem('tripPartnerList'));
    const tripLocal = JSON.parse(await AsyncStorage.getItem('trip'));

    trips?.map(async ({ tripReference }) => {
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

  const onTripAcceptedReadyScheduled: TripCallback = async ({ data: trip, type }) => {
    if (['added', 'modified'].includes(type)) {
      const ride = trip?.ride as any;
      const isSharedTrip = ride && Array.isArray(ride.riders) && ride.riders.length > 0;

      if (isSharedTrip) {
        const userIsRider = ride.riders.some((rider: any) =>
          rider.userId === user?.idUser?.toString() || rider.userId === String(user?.idUser)
        );

        if (!userIsRider) {
          return;
        }
      }

      navigation.navigate('TripRoutes', { screen: 'Trip' });
      openApp();

      if (!!trip?.schedule || !!trip?.schedule && trip?.status === STATUS_ACCEPTED) {
        dispatchTripCustomer({ type: 'update', field: 'visibleLookUpAddressesModal', arg: false });
        dispatchTripCustomer({ type: 'update', field: 'showModalScheduled', arg: true });
      }
    }

    if (type === 'removed') {
      if (trip?.status === STATUS_IN_PROGRESS || trip?.status === STATUS_ACCEPTED) {
        dispatchTripCustomer({ type: 'update', field: 'showModalScheduled', arg: false });
      }
    }
  }

  const audioPermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();

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
  }

  const getBarCodeScannerPermissions = async () => {
    if (!cameraPermission.granted) {
      await requestCameraPermission();
    }
  };

  const fetchLocation = useCallback(async () => {
    try {
      const location = await Location.getLastKnownPositionAsync();

      if (location?.coords) {
        setPosition({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        const { coords } = await Location.getCurrentPositionAsync({ accuracy: 1 });
        setPosition({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      }
    } catch (error) {
      console.error('Erro ao obter a localização:', error);
    }
  }, [setPosition]);

  const initializePermissions = async () => {
    await audioPermission();
    await getBarCodeScannerPermissions();
    await syncDeviceToken();
  };

  useEffect(() => {
    if (loading || loadingTrips) return;

    requestAnimationFrame(() => {
      void initializePermissions();
    });
  }, [loading, loadingTrips]);

  useEffect(() => {
    const refreshLocation = async () => {
      setLoading(true);
      try {
        await getPermissionLocal();
        await fetchLocation();
      } catch (error) {
        console.error('Error initializing location:', error);
      } finally {
        setLoading(false);
      }
    };

    refreshLocation();

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const listener = AppState.addEventListener('change', state => {
      if (state === 'active') {
        if (debounceTimer) return;
        debounceTimer = setTimeout(async () => {
          debounceTimer = null;
          try {
            await getPermissionLocal();
            await fetchLocation();
          } catch (error) {
            console.error('Error on AppState change:', error);
          }
        }, 1000);
      }
    });

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      listener.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribeTripAcceptedReadyScheduled = tripRealtime.checkTripAcceptedReadyScheduled(
      user?.idUser, onTripAcceptedReadyScheduled
    );

    handleVerifyTripPartnerList();

    return () => {
      if (unsubscribeTripAcceptedReadyScheduled) {
        tripRealtime.unsubscribe(unsubscribeTripAcceptedReadyScheduled);
      }
    };
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
    if (position) {
      getConfigByPosition(position);
    }
  }, [position]);

  // Verifica se não há motoristas disponíveis e mostra modal OfferOtherTrip
  useEffect(() => {
    if (showDriverSearchFromCache && driversNears && driversNears.length === 0) {
      // Limpa dados antigos para evitar conflitos
      dispatchTripCustomer({
        type: 'update',
        field: 'origin',
        arg: {},
      });

      dispatchTripCustomer({
        type: 'update',
        field: 'destination',
        arg: {},
      });

      dispatchTripCustomer({
        type: 'update',
        field: 'selectedOptionTravel',
        arg: {},
      });

      dispatchTripCustomer({
        type: 'update',
        field: 'selectedPaymentMethod',
        arg: {},
      });

      // Limpa caches antigos
      AsyncStorage.removeItem(PIX_CACHE_KEY);
      AsyncStorage.removeItem(TRIP_CACHE_KEY);

      setShowDriverSearchFromCache(false);
    }
  }, [showDriverSearchFromCache, driversNears]);

  // Monitora o estado offerOtherTypeTrip do contexto Trip
  useEffect(() => {
    if (offerOtherTypeTrip) {
      setShowDriverSearchFromCache(false);

      // Limpa caches
      AsyncStorage.removeItem(PIX_CACHE_KEY);
      AsyncStorage.removeItem(TRIP_CACHE_KEY);
    }
  }, [offerOtherTypeTrip]);

  useEffect(() => {
    if (completedTripData) {
      setTimeout(() => {
        setShowTripFinishModal(true);
      }, 400);
    }
    return setShowTripFinishModal(false);
  }, [completedTripData]);

  async function requestMicrophonePermission() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    requestMicrophonePermission();
    if (textVoice) {
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
    try {
      const language = await AsyncStorage.getItem('@language');
      const formatedLanguage = language.replace('_', '-');

      setShowModalVoiceRecord(false);
      Speech.speak(
        `${translate('home.modal_voice_hello')} ${user?.nameUser?.split(' ')[0] || user?.nickname
        } ${translate('home.modal_voice_where_go')} `,
        {
          language: formatedLanguage,
          rate: 0.8,
          onDone: () => {
            setLoadingVoice(true);
            setShowModalVoiceRecord(true);
          },
        },
      );
      setModalMic(true);
    } catch (error) {
      console.log(error);
    }
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

  const handleRedirectTripsSpeedMob = async () => {
    if (!await authorizedTravelUser()) return;

    setTimeout(() => {
      navigation.navigate('TripRoutes', { screen: 'TripSpeedMob' });
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

  const Pulse = ({ delay = 0, repeat }) => {
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
        transform: [{ scale: animation.value }],
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

  const handleCloseModalAlert = () => {
    dispatchTripCustomer({
      type: 'update',
      field: 'timeExceededFee',
      arg: {
        title: null,
        description: null,
        show: false,
      },
    });
  };

  const handleCloseModalVoiceRecording = () => {
    setTextVoice('');
    setLoadingVoice(false);
    setModalMic(false);
    setShowModalVoiceRecord(false);
  };

  const clearCacheTripPartnerAnothe = async () => {
    await AsyncStorage.removeItem('@app:tripNoDestination');
    await AsyncStorage.removeItem('@app:tripNoDestinationAnother');
  };

  useFocusEffect(
    useCallback(() => {
      clearCacheTripPartnerAnothe();

      fadeIn();

      if (position?.latitude && position?.longitude) {
        mapRef?.current?.animateToRegion({
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
    }, [position]),
  );

  useEffect(() => {
    showModalNoCity(globalShowModalNoCity);
  }, [globalShowModalNoCity]);

  useEffect(() => {
    const checkPixCache = async () => {
      const pixData = await AsyncStorage.getItem(PIX_CACHE_KEY);
      const tripData = await AsyncStorage.getItem(TRIP_CACHE_KEY);

      try {
        if (pixData === null) {
          return;
        }

        const parsedPixData = JSON.parse(pixData);
        if (tripData === null) {
          await AsyncStorage.removeItem(PIX_CACHE_KEY);
          return;
        }

        const parsedTripData = JSON.parse(tripData);
        if (!parsedTripData.origin || !parsedTripData.destination || !parsedTripData.selectedOptionTravel) {
          await AsyncStorage.removeItem(PIX_CACHE_KEY);
          await AsyncStorage.removeItem(TRIP_CACHE_KEY);
          return;
        }

        Object.entries(parsedTripData).forEach(([key, value]) => {
          dispatchTripCustomer({ type: 'update', field: key, arg: value });
        });

        if (parsedTripData.polylineCoordinates) {
          dispatchTripCustomer({
            type: 'update',
            field: 'lastPolylineCoordinates',
            arg: parsedTripData.polylineCoordinates,
          });
        }

        navigation.navigate('TripPixPayment', {
          origin: 'Home',
          pixCode: parsedPixData.pixKey.key,
          amount: parsedPixData.price,
        });

      } catch (error) {
        await AsyncStorage.removeItem(PIX_CACHE_KEY);
        await AsyncStorage.removeItem(TRIP_CACHE_KEY);
      }
    };

    checkPixCache();
  }, [navigation, dispatchTripCustomer]);

  const handleModalNoCityPress = () => {
    showModalNoCity(false);
    dispatchTripCustomer({
      type: 'update',
      field: 'showModalNoCity',
      arg: false,
    });
  };

  // Função para limpar cache do PIX
  const clearPixCache = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(PIX_CACHE_KEY);
      await AsyncStorage.removeItem(TRIP_CACHE_KEY);
    } catch (error) {
      console.error('❌ Erro ao limpar cache do PIX:', error);
    }
  }, []);

  useEffect(() => {
    if ((routeInfo.params as any)?.pixCacheAction === 'cancel') {
      clearPixCache();
      navigation.setParams({ pixCacheAction: undefined });
    }
  }, [(routeInfo.params as any)?.pixCacheAction]);

  async function initializeActiveTrips(tripsActives: TripActive[]) {
    if (tripsActives.length === 0) {
      return;
    }

    const activeTrip = tripsActives?.[0];
    if (!activeTrip) return;

    try {
      handleTripStateChange(activeTrip.tripReference);
    } catch (error) {
      console.log("Erro ao verificar viagens ativas", error);
    }
  }

  useEffect(() => {
    initializeActiveTrips(tripsActives);
  }, [tripsActives]);

  return (
    <RootContainer>

      <Preload visible={(loading || loadingTrips)} />
      {timeExceededFee.show && (
        <ModalAlert
          icon="warning"
          title={timeExceededFee.title}
          body={timeExceededFee.description}
          visibleModal={timeExceededFee.show}
          handleSubmissModal={handleCloseModalAlert}
        />
      )}
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
          clearTrip();
        }}
      />
      {tripPartnerList?.length > 0 && (
        <TripPartnerInfo setVisible={setTripListVisibility} />
      )}
      {tripListVisibility && (
        <TripListModal
          visible={tripListVisibility}
          setVisible={setTripListVisibility}
          trips={tripPartnerList}
        />
      )}
      <MapCardWrapper>
        <MapCard>
          <MapView
            ref={mapRef}
            style={styles.mapFill}
            showsUserLocation={!polylineCoordinates && !position}
            showsMyLocationButton={false}
            showsCompass={false}
            customMapStyle={Platform.OS === 'ios' ? null : mapStyle}
            userInterfaceStyle="light"
          >
            {position && (
              <CurrentLocationMarker
                latitude={position.latitude}
                longitude={position.longitude}
              />
            )}
            {driversNears?.length > 0 && driversNears.map((driver, index) => (
              <CustomMarkerDriverNear data={driver} key={index} />
            ))}
          </MapView>

          <Header>
          {init !== 'Speedmob' && (
            <HomeMapHeader
              greetingName={`${translate('home.text_hello')} ${
                user ? user?.nameUser?.split(' ')[0] : translate('home.text_welcome')
              }!`}
              avatarUri={user?.profileImageLink || getStoragePictureSpecific('customer')}
              onAvatarPress={() => navigation.navigate('Profile')}
            />
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
        </MapCard>

        {/* Modal de inicio na simulação de viagem */}
        {init !== 'Speedmob' && !showDriverSearchFromCache && (
          <HomeBottomSheet
            mapRef={mapRef}
            position={position}
            onPositionChange={setPosition}
            searchPlaceholder={
              generalSettings.find(item => item?.key === 'title_for_home')?.value ||
              translate('home.text_where_we_go')
            }
            onSearchPress={handleInputPress}
            onMicPress={speakUnicMessage}
            moduleButtons={moduleButtons}
            onModulePress={handleModulePress}
            publicityList={publicityList}
          />
        )}

        {init === 'Speedmob' && (
          <ContentButtonCallRacer>
            <AnimatedNative.View style={[{ opacity: fadeAnim }]}>
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

        {/* DriverSearch quando PIX for carregado do cache */}
        {showDriverSearchFromCache && (
          <DriverSearchOverlay>
            <DriverSearch />
          </DriverSearchOverlay>
        )}
      </MapCardWrapper>

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
          {loadingVoice && (
            <VoicePulse
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
            />
          )}

          {/* <IfLoaderInsideScreen loading={loadingVoice}> */}
          <Ionicons
            name="mic"
            color={!loadingVoice ? theme.colors.primary : theme.colors.red}
            size={RFValue(80)}
            style={styles.micIconMargin}
          />
          {/* </IfLoaderInsideScreen> */}

          {showModalVoiceRecord && (
            <WebViewVoiceRecognition
              setText={setTextVoice}
              text={textVoice}
              width={1}
              setStartLoading={setLoadingVoice}
              height={1}
              sizeIcon={1}
              automatic
              showModalVoiceRecord={showModalVoiceRecord}
              setShowModalVoiceRecord={setShowModalVoiceRecord}
              handleOnTheEnd={handleCloseModalVoiceRecording}
            />
          )}
        </ViewVoice>
      </ModalFrame>
      {globalShowModalNoCity && (
        <CardNoCity onPress={handleModalNoCityPress} />
      )}
    </RootContainer>
  );
}
