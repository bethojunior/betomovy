import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  BatteryOptEnabled,
  RequestDisableOptimization,
} from 'react-native-battery-optimization-check';
import { useAuth } from '../../../../context/auth';
import {
  Container,
  ContainerButtonFloat,
  ViewPanic,
  ContentButtonFloatsAndPanic,
} from './styles';
import { If } from '../../components/If';
import { useUserDriver } from '../../context/userDriver';
import { translate } from '../../../../client/locales';
import { useStationReturn } from '../../context/StationReturn';
import { CardPanic } from '../../components/CardPanic';
import { usePanic } from '../../context/Panic';
import { ModalOff } from '../../components/ModalOff';
import Helper from '../../utils/Helper';
import { customToast } from '../../../../utils/FlashMessage';
import { TripTypeUnic } from '../../components/ViewTaximeter/types';
import ModalFrame from '../../components/Modal/ModalFrame';
import { FloatButton } from '../../components/FloatButton';
import { ModalNavigation } from '../../components/ModalNavigation';
import { MapSuggestionModal } from '../../components/Modal/MapSuggestionModal';
import { useMenu } from '../../context/menu';
import { useModules } from '../../../../client/contexts/modules';
import Preload from '../../components/Preload';
import { useNetwork } from '../../../../context/ConfigGlobal';
import { bubble } from './service';
import NavigationMap, { NavigationMapRef } from '../../components/NavigationMap';
import { PanicButtonTriggeredModal } from '../../components/Modal/PanicButtonTriggeredModal';
import Collapse from '../../../../client/components/Collapse';

import theme from '../../../../client/styles/theme';

import { ModalCallTripComponent } from '../../components/ModalCallTripComponent';
import { ModalInTripComponent } from '../../components/ModalInTripComponent';
import { ModalAndButtonPreAcceptedComponent } from '../../components/ModalAndButtonPreAcceptedComponent';
import { PendingOfflineFinishBanner } from '../../components/PendingOfflineFinishBanner';
import { IniTripModalComponent } from '../../components/IniTripModalComponent';
import { AlertPanicComponent } from '../../components/AlertPanicComponent';
import { NotificationComponent } from '../../components/NotificationComponent';
import { TripPreAcceptedComponent } from '../../components/TripPreAcceptedComponent';
import { CheckBatteryComponent } from '../../components/CheckBatteryComponent';
import { WebViewMapComponent } from '../../components/WebViewMapComponent';
import { ButtonTargetComponent } from '../../components/ButtonTargetComponent';
import { TripRealtimeScheduleAccepted } from '../../components/TripRealtimeScheduleAccepted';
import { TripRealtimeScheduleCall } from '../../components/TripRealtimeScheduleCall';
import { TripRealtimeSearchOffer } from '../../components/TripRealtimeSearchOffer';
import { FloatButtonsComponent } from '../../components/FloatButtonsComponent';
import { FloatButtonHandleMyLocation } from '../../components/FloatButtonHandleMyLocation';
import { ButtonTaximeterComponent } from '../../components/ButtonTaximeterComponent';
import { DoorHandleComponent } from '../../components/DoorHandleComponent';
import { InicializeComponent } from '../../components/InicializeComponent';
import UpdateLocationMap from '../../components/UpdateLocationMap';
import { TaximeterComponent } from '../../components/TaximeterComponent';
import { ModalsProvider } from '../../../../context/Modals';
import MenuComponent from '../../components/MenuComponent';
import { TripRealtimeDelivery } from '../../components/TripRealtimeDelivery';
import { ButtonScrollViewTaximeter } from '../../components/ButtonScrollView';
import TripProgressTopInfo from '../../components/TripProgressTopInfo';
import { useTripProvider } from '../../context/Trip';
import { ModalAlert } from '../../components/ModalAlert';
import { Audio } from 'expo-av';
import { TripRealtimeInit } from '../../components/TripRealtimeInit';
import { BlockDriver } from '../../components/BlockDriver';
import { setIniTripModal, useIniTripModal } from '../../store/iniTripModal';
import { useLocal } from '../../hooks/location';
import { useDriverStatus } from '../../hooks/useDriverStatus';
import { emitDriverLocation } from '~/utils/driverLocationEmmit';
import { SimulationOverlay } from '../../components/SimulationOverlay';
import { useDevTools } from '../../context/DevTools';
import { useActiveKeepAwake } from '../../hooks/keepAwake';
enum MapType {
  standard = 'standard',
  satellite = 'satellite',
  hybrid = 'hybrid',
  terrain = 'terrain',
  none = 'none',
  mutedStandard = 'mutedStandard',
}

export function Home({ route }) {
  useActiveKeepAwake();

  const [modalVisible, setModalVisible] = useState(false);
  const [typesProblems, setTypesProblems] = useState([]);
  const { init } = useModules();
  const { simulation } = useDevTools();

  const { tripSummary, isAcceptingTrip } = useTripProvider((context) => context.stateTrip);

  const [preloadVisible, setPreloadVisible] = useState(false);
  const [visibleQrCode, setVisibleQrCode] = useState(false);
  const [weeklyEarningsData, setWeeklyEarningsData] = useState([]);
  const [weeklyEarningsTotal, setWeeklyEarningsTotal] = useState('');
  const [countVisible, setCountVisible] = useState(false);
  const iniTripModal = useIniTripModal();
  const [finishTripModal, setFinishTripModal] = useState(false);
  const [modalTaximeter, setModalTaximeter] = useState(false);
  const [modalNavigation, setModalNavigation] = useState(false);
  const showMapSuggestion: any = useTripProvider(
    (context: any) => context.stateTrip.showMapSuggestion,
  );
  const dispatchTrip: any = useTripProvider(
    (context: any) => context.dispatchTrip,
  );
  const [selectedTripType, setSelectedTripType] = useState<TripTypeUnic>(
    {} as TripTypeUnic,
  );
  const [mapType, setMapType] = useState<MapType>(MapType.terrain);
  const [showMenuButton, setShowMenuButton] = useState<boolean>(false);

  const [swalVisible, setSwalVisible] = useState(false);
  const [modalHorasLimites, setModalHorasLimites] = useState(false);

  const { generalSettings, setNewActionFb, getConfigByPosition, syncDeviceToken } = useAuth();

  const [onVisibleMap, setOnVisibleMap] = useState(false);
  const navigationMapRef = useRef<NavigationMapRef>(null);
  const [firstLoad, setFirstLoad] = useState(false);

  const refButtonMenu = useRef<any>(null);
  const emitLocationDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { getMenuOptions } = useMenu();

  const { getListProblems } = usePanic();
  const { cityConfig } = useAuth();
  const { itsNetwork } = useNetwork();

  const { userDriverFind, getWeeklyEarnings } = useUserDriver();
  const { isOnline, isBusy } = useDriverStatus();
  const { getStationReturnById, stationsById } = useStationReturn();
  const { navigate } = useNavigation<any>();
  const isFocused = useIsFocused();
  const { location } = useLocal();

  const checkHorasLimites = (_showModalCallback?: () => void) => {
    return true;
  };

  // Função para mostrar o modal de horas limites
  const showModalHorasLimites = () => {
    setModalHorasLimites(true);
  };

  const handleShowMenuButtons = () => {
    showMenuButton ? setShowMenuButton(false) : setShowMenuButton(true);
  };

  const mountSong = async () => {
    const { sound } = await Audio.Sound.createAsync(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../assets/songs/scheduledTrip.mp3'),
    );
    return sound;
  };

  useEffect(() => {
    if (location.coords) {
      getConfigByPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      void syncDeviceToken();
    });
  }, []);

  const getEarnings = async () => {
    const response = await getWeeklyEarnings();

    setWeeklyEarningsTotal(response.earningsTotal);

    if (response) {
      response.earnings.map(item => {
        return setWeeklyEarningsData(oldArray => [
          ...oldArray,
          { day: item.slug, earnings: item.total_day },
        ]);
      });
    }
  };

  const listProblems = async () => {
    const response = await getListProblems();
    if (!response.status) {
      return;
    }
    setTypesProblems(response?.data);
  };

  const getPermissionsActions = async () => {
    // Aqui apenas verifica bateria (Android only — no-op no iOS).
    BatteryOptEnabled().then(isEnabled => {
      if (isEnabled) {
        RequestDisableOptimization();
      }
    });
  };

  const getLastMapType = async () => {
    const mapType: any = await AsyncStorage.getItem('mapType');
    if (mapType) {
      setMapType(mapType);
    }
  };

  const stations = async () => {
    const response = await getStationReturnById();
    if (!response.status) {
      return customToast(response.message, 'danger');
    }
  };

  useEffect(() => {
    const startup = async () => {
      if (!itsNetwork || firstLoad) {
        return;
      }

      try {
        // 1. Permissões básicas e sequenciais (já otimizadas no Provider)
        await getPermissionsActions();

        // 2. Outras chamadas de API necessárias
        await Promise.all([
          stations(),
          listProblems(),
          getMenuOptions(),
          getEarnings(),
          getLastMapType(),
        ]);

        setFirstLoad(true);
      } catch (error) {
        console.log('[Home] startup(): Erro ao inicializar o app.', error);
      }
    };

    startup();
  }, [itsNetwork]);

  useEffect(() => {
    if (isOnline || isBusy) {
      bubble(
        userDriverFind?.idDriver,
        theme,
        cityConfig?.showNetValueForDriverOnCall,
        Helper.generalSettingsValue(generalSettings, 'show_more_calcs_driver'),
        Helper.generalSettingsActive(generalSettings, 'enable_realtime_socket'),
        cityConfig,
      );
    }
  }, [itsNetwork, isOnline, isBusy]);

  useEffect(() => {
    if (route.params?.visible) {
      setIniTripModal(true);
    }
  }, [route]);

  const handleClearModal = () => {
    setShowMenuButton(false);
  };

  const confirmationAcceptTrip = async (status: boolean = null) => {
    if (status) {
      // setFinishTripModal(false);
      setIniTripModal(true);
    }
  };

  useEffect(() => {
    if (
      userDriverFind?.driverRegisterStatusId &&
      userDriverFind.driverRegisterStatusId !== '1'
    ) {
      navigate('StatusPending');
      setNewActionFb('');
    }
  }, [userDriverFind?.driverRegisterStatusId]);

  const notif = false;
  const isDriverSettingsEnabled =
    generalSettings.find(item => item?.key === 'enable_driver_v2')?.value ===
    '0';
  const hasSchedulesOrTrips =
    tripSummary.totalScheduledAvailable !== 0 ||
    tripSummary.totalScheduledAccepted !== 0 ||
    tripSummary.totalOfferTrips !== 0;

  const marginTop = isDriverSettingsEnabled && hasSchedulesOrTrips ? 90 : 0;

  const containerButtonFloatStyle = {
    marginTop: marginTop,
  };

  useEffect(() => {
    if (swalVisible) {
      mountSong().then(async soung => {
        Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        await soung?.playAsync().then(() => { });
      });
    }
  }, [swalVisible]);



  useEffect(() => {
    if (userDriverFind && location?.coords) {
      if (emitLocationDebounceRef.current) clearTimeout(emitLocationDebounceRef.current);
      emitLocationDebounceRef.current = setTimeout(() => {
        emitDriverLocation(userDriverFind, location?.coords, cityConfig);
      }, 2000); // debounce de 2s para evitar flood de microtasks no Hermes
    }

    return () => {
      if (emitLocationDebounceRef.current) clearTimeout(emitLocationDebounceRef.current);
    };
  }, [location, userDriverFind]);

  return (
    <ModalsProvider>
      <TripProgressTopInfo hide={finishTripModal} />
      <SimulationOverlay visible={simulation.active} />
      <PendingOfflineFinishBanner />

      <Container>
        <ButtonTargetComponent />
        <PanicButtonTriggeredModal />
        <Preload visible={preloadVisible || isAcceptingTrip} />

        <ModalAlert
          icon="info"
          title={`${translate('service.title_schedule_compliments')} ${userDriverFind.name
            }. ${translate('service.title_schedule_modal')}`}
          body={translate('service.text_schedule_modal')}
          visibleModal={swalVisible}
          handleSubmissModal={() => setSwalVisible(false)}
        />

        <BlockDriver />

        <MenuComponent />

        {userDriverFind?.isDeliveryMan === '0' && (
          <>
            <ModalCallTripComponent
              showInitModal={confirmationAcceptTrip}
              receivedNotification={notif}
              setPreloadVisible={setPreloadVisible}
            />

            <ModalInTripComponent
              visible={iniTripModal}
              setVisible={setIniTripModal}
            />

            <ModalAndButtonPreAcceptedComponent />
            <NavigationMap
              onPress={() => setCountVisible(false)}
              ref={navigationMapRef}
            />

            <If condition={countVisible}>
              <ViewPanic>
                <CardPanic
                  data={typesProblems}
                  setVisible={setCountVisible}
                />
              </ViewPanic>
            </If>
            {init === 'Speedmob' && (
              <ContainerButtonFloat>
                <FloatButton
                  ref={refButtonMenu}
                  icon={
                    <MaterialIcons
                      name="my-location"
                      size={24}
                      color={theme.colors.primaryText}
                    />
                  }
                  onPress={() =>
                    navigationMapRef.current?.handleMyLocation(false)
                  }
                />
              </ContainerButtonFloat>
            )}

            <TripRealtimeInit
              setIniTripModal={setIniTripModal}
              setSwalVisible={setSwalVisible}
              setVisibleQrCode={setVisibleQrCode}
              onDriverTripStart={navigationMapRef.current?.zoomToMapMarker}
              iniTripModal={iniTripModal}
              setPreloadVisible={setPreloadVisible}
            />
            <TripRealtimeScheduleAccepted />
            <TripRealtimeScheduleCall />
            <TripRealtimeSearchOffer />
            <UpdateLocationMap />
            <TripPreAcceptedComponent />
          </>
        )}

        {userDriverFind?.isDeliveryMan === '1' && (
          <TripRealtimeDelivery />
        )}

        <CheckBatteryComponent />

        {userDriverFind?.isDeliveryMan === '0' && (
          <>
            {init !== 'Speedmob' && (
              <ContainerButtonFloat>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <FloatButton
                      backgrounColorButton={theme.colors.background_white}
                      icon={
                        <Ionicons
                          name={showMenuButton ? 'close' : 'menu'}
                          size={RFValue(24)}
                          color={theme.colors.primary}
                        />
                      }
                      onPress={handleShowMenuButtons}
                    />
                    <Collapse open={showMenuButton}>
                      <NotificationComponent onPress={handleClearModal} />
                      <FloatButtonHandleMyLocation
                        callback={
                          navigationMapRef.current?.handleMyLocation
                        }
                      />
                      <ButtonTaximeterComponent
                        onPress={handleShowMenuButtons}
                        setModalTaximeter={setModalTaximeter}
                        selectedTripType={selectedTripType}
                      />
                    </Collapse>
                  </View>
                  <ContentButtonFloatsAndPanic>
                    <AlertPanicComponent
                      setCountVisible={setCountVisible}
                    />
                    <FloatButtonsComponent
                      setModalNavigation={setModalNavigation}
                      setOnVisibleMap={setOnVisibleMap}
                    />
                  </ContentButtonFloatsAndPanic>
                </View>
              </ContainerButtonFloat>
            )}
            <DoorHandleComponent
              setVisibleQrCode={setVisibleQrCode}
              visibleQrCode={visibleQrCode}
            />
            <ModalFrame
              visible={modalTaximeter}
              onClose={() => { }}
              hideConfirm
              setVisible={setModalTaximeter}
              scrollable
              contentStyle={{ maxHeight: 420 }}
            >
              <ButtonScrollViewTaximeter
                setModalTaximeter={setModalTaximeter}
                setSelectedTripType={setSelectedTripType}
              />
            </ModalFrame>
            <TaximeterComponent
              onClose={() => {
                setSelectedTripType({} as TripTypeUnic);
              }}
              setSelectedTripTaximeter={setSelectedTripType}
              setModalTaximeter={setModalTaximeter}
              selectedTripTaximeter={selectedTripType}
              setIniTripModal={setIniTripModal}
            />
          </>
        )}
        {/* FIM MODAIS */}
        {userDriverFind?.isDeliveryMan === '0' && (
          <>
            <IniTripModalComponent
              version={
                init !== 'Speedmob'
                  ? generalSettings?.find(
                    item => item?.key === 'enable_driver_v2',
                  )?.value
                  : '2'
              }
              modalVisible={modalVisible}
              iniTripModal={iniTripModal}
              visibleQrCode={visibleQrCode}
              setVisibleQrCode={setVisibleQrCode}
              setModalVisible={setModalVisible}
              setIniTripModal={setIniTripModal}
              setFinishTripModal={setFinishTripModal}
              checkHorasLimites={checkHorasLimites}
              showModalHorasLimites={showModalHorasLimites}
            />

            <ModalOff
              isSpeedmob={init === 'Speedmob'}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              stationsById={stationsById}
              weeklyEarningsData={weeklyEarningsData}
              weeklyEarningsTotal={weeklyEarningsTotal}
            />
          </>
        )}

        <WebViewMapComponent
          onVisibleMap={onVisibleMap}
          setOnVisibleMap={setOnVisibleMap}
        />
        <If condition={modalNavigation}>
          <ModalNavigation
            modalNavigation={modalNavigation}
            setModalNavigation={setModalNavigation}
          />
        </If>

        <MapSuggestionModal
          visible={showMapSuggestion && isFocused}
          setVisible={(visible) => {
            dispatchTrip({ type: 'update', field: 'showMapSuggestion', arg: visible });
          }}
        />

        {/* Modal de Horas Limites */}
        <Modal
          visible={modalHorasLimites}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalHorasLimites(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end'
          }}>
            <View style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              paddingBottom: 40,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              {/* Indicador de arraste */}
              <View style={{
                width: 40,
                height: 4,
                backgroundColor: '#ddd',
                borderRadius: 2,
                alignSelf: 'center',
                marginBottom: 20
              }} />

              {/* Título */}
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                color: theme.colors.secondary,
                marginBottom: 20
              }}>
                Atenção
              </Text>

              {/* Conteúdo */}
              <View style={{ alignItems: 'center' }}>
                <Ionicons
                  name="time-outline"
                  size={50}
                  color={theme.colors.primary}
                  style={{ marginBottom: 15 }}
                />
                <Text style={{
                  fontSize: 16,
                  textAlign: 'center',
                  color: theme.colors.secondary,
                  lineHeight: 22
                }}>
                  As horas limites de trabalho foram atingidas.
                </Text>
                <Text style={{
                  fontSize: 14,
                  textAlign: 'center',
                  color: theme.colors.secondary,
                  marginTop: 10,
                  lineHeight: 20
                }}>
                  Por questões de segurança, é necessário fazer uma pausa antes de continuar trabalhando.
                </Text>
              </View>

              {/* Botão de fechar */}
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primary,
                  padding: 15,
                  borderRadius: 10,
                  marginTop: 20,
                  alignItems: 'center'
                }}
                onPress={() => setModalHorasLimites(false)}
              >
                <Text style={{
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 'bold'
                }}>
                  Entendi
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Container>
    </ModalsProvider >
  );
}
